import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

//const client = ipfsHttpClient("https://ipfs.infura.io:5001");
//dupa ultimul update nu mai e nevoie de ipfsclient, nu umbla la asta

const projectId = "2IozygPhxtxOTTsuoY7clBgKQJn";
const projectSecretKey = "8234a4bc11dbf15c2f2efdbb8ffb7e0f";
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;

const subdomain = "https://metaquantumnftmarketplace.infura-ipfs.io";

const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

//INTERNAL IMPORT
import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants";

//-------FETCHING LE SMART KONTRAKT
const fetchContract = (singerOrProvider) =>
 new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    singerOrProvider
 );

 //-------CONNECTING WITH SMART KONTRACT

 const connectingWithSmartContract = async () => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner()
        const contract = fetchContract(signer);
        return contract;
    } catch (error) {
        console.log("Something went wrong while connecting with contract");
    }
 };

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
    const titleData = "Discover, collect, and sell NFTs";

    //-------USESTATE
    const [currentAccount, setCurrentAccount] = useState("");
    const router = useRouter();

    //----CHECK IF WALLET IS CONNECTED
    const checkIfWalletConnected = async () => {
      try {
        if (!window.ethereum)
          return setOpenError(true), setError("Install MetaMask");
  
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
  
        if (accounts.length) {
          setCurrentAccount(accounts[0]);
        } else {
          //setError("No Account Found");
          //setOpenError(true);
          console.log("No Account Found");
        }

      } catch (error) {
        //setError("Something wrong while connecting to wallet");
        //setOpenError(true);
        console.log("Something wrong while connecting to wallet");
      }
    };

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    //----CONNECT WALLET FUNCTION
    const connectWallet = async () => {
        try {
          if (!window.ethereum)
            return setOpenError(true), setError("Install MetaMask");
    
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setCurrentAccount(accounts[0]);
          // window.location.reload();
        } catch (error) {
          //setError("Error while connecting to wallet");
          //setOpenError(true);
          console.log("Error while connecting to wallet");
        }
      };

      //----UPLOAD TO IPFS FUNCTION
      const uploadToIPFS = async (file) => {
        try {
          const added = await client.add({ content: file });
          const url = `${subdomain}/ipfs/${added.path}`;
          return url;
        } catch (error) {
          //setError("Error Uploading to IPFS");
          //setOpenError(true);
          console.log("Error Uploading to IPFS");
        }
      };

      //-------CREATE NFT FUNCTION
      const createNFT = async (name, price, image, description, router) => {
        if (!name || !description || !price || !image)
          return setError("Data Is Missing"), setOpenError(true);
    
        const data = JSON.stringify({ name, description, image });
    
        try {
          const added = await client.add(data);
    
          const url = `https://infura-ipfs.io/ipfs/${added.path}`;
    
          await createSale(url, price);
          //router.push("/searchPage");
        } catch (error) {
          //setError("Error while creating NFT");
          //setOpenError(true);
          console.log("Error while creating NFT");
        }
      };

      //----------CREATE SALE FUNCTION
      const createSale = async (url, formInputPrice, isReselling, id) => {
        try {
          console.log(url, formInputPrice, isReselling, id);
          const price = ethers.utils.parseUnits(formInputPrice, "ether");
    
          const contract = await connectingWithSmartContract();
    
          const listingPrice = await contract.getListingPrice();
    
          const transaction = !isReselling
            ? await contract.createToken(url, price, {
                value: listingPrice.toString(),
              })
            : await contract.resellToken(id, price, {
                value: listingPrice.toString(),
              });
    
          await transaction.wait();
          router.push("./searchPage")
        } catch (error) {
          //setError("error while creating sale");
          //setOpenError(true);
          console.log("error while creating sale");
        }
      };

      //---------FETCH NFT FUNCTION

      // GRIJA MARE CU MULTE 
          // FUNCTII DE AICI PENTRU CA SUNT TRASE DIN SMART CONTRACT
          // DACA SCHIMBI LUCRURI PRIN SMART CONTRACT LE SCHIMBI SI AICI!!!!
  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems();
      console.log(data);

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );

      // console.log(items);
      return items;
    } catch (error) {
      //setError("Error while fetching NFTS");
      //setOpenError(true);
      console.log("Error while fetching NFTS");
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [])

  //------FETCHING MY NFT OR LISTED NFTs
  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      const contract = await connectingWithSmartContract();

      const data =
        type == "fetchItemsListed"
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      return items;
    } catch (error) {
      //setError("Error while fetching listed NFTs");
      //setOpenError(true);
      console.log("Error while fetching listed NFTs");
    }
  };

  //----BUY NFT FUNCTION
  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      await transaction.wait();
      //router.push("/author");
    } catch (error) {
      //setError("Error While buying NFT");
      //setOpenError(true);
      console.log("Error While buying NFT");
    }
  };

    return (
        <NFTMarketplaceContext.Provider
         value={{ 
            titleData,
            checkIfWalletConnected,
            connectWallet,
            uploadToIPFS,
            createNFT,
            fetchNFTs,
            fetchMyNFTsOrListedNFTs,
            buyNFT,
            currentAccount
             }}>
            {children}
        </NFTMarketplaceContext.Provider>
    )
}