import React from 'react';
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./Service.module.css";
import images from "../../img";

const Service = () => {
  return (
    <div className={Style.service}>
        <div className={Style.service_box}>
            <div className={Style.service_box_item}>
                <Image 
                src={images.service1} 
                alt="Filter & Discover" 
                width={100} 
                height={100}
                />
                <p className={Style.service_box_item_step}>
                    <span>Step 1</span>
                </p>
                <h3>Filter & Discover</h3>
                <p>
                Connect with wallet, discover, buy NTFs, sell your NFTs and earn
            money
                </p>
            </div>
            <div className={Style.service_box_item}>
                <Image 
                src={images.service2} 
                alt="Filter & Discover" 
                width={100} 
                height={100}
                />
                <p className={Style.service_box_item_step}>
                    <span>Step 9?</span>
                </p>
                <h3>Access Anywhere</h3>
                <p>
                If you are on WC and you want to trade your NFT, go ahead.
                </p>
            </div>
            <div className={Style.service_box_item}>
                <Image 
                src={images.service3} 
                alt="Connect Wallet" 
                width={100} 
                height={100}
                />
                <p className={Style.service_box_item_step}>
                    <span>Step 33</span>
                </p>
                <h3>Connect Wallet</h3>
                <p>
                Connect with wallet, discover, buy NTFs, sell your NFTs and earn
            money
                </p>
            </div>
            <div className={Style.service_box_item}>
                <Image 
                src={images.service4} 
                alt="Connect Wallet" 
                width={100} 
                height={100}
                />
                <p className={Style.service_box_item_step}>
                    <span>Step 69</span>
                </p>
                <h3>Start Trading</h3>
                <p>
                Do your best to trade and lose so we'll get rich xD
                </p>
            </div>
        </div>
    </div>
  );
};

export default Service