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
                    <span>Download</span>
                </p>
                <h3>Filter & Discover</h3>
                <p>
                Get a tutorial handbook and discover our platform!
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
                    <span>Your turn</span>
                </p>
                <h3>Access Anywhere</h3>
                <p>
                Trade your NFT remotely. Anywhere. Everywhere.
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
                    <span>Join us</span>
                </p>
                <h3>Connect Wallet</h3>
                <p>
                Connect your wallet, discover, trade NFTs and earn more!
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
                    <span>Demo</span>
                </p>
                <h3>Start Trading</h3>
                <p>
                Begin your trading journey now!
                </p>
            </div>
        </div>
    </div>
  );
};

export default Service