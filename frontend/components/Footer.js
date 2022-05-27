import React from "react";

const Footer = () => {
  return (
    <div className="flex justify-center items-center flex-wrap pt-6 pb-6 bg-transparent border-0">
      <p className=" text-md text-bold text-gray-400">Powered by</p>
      <a
        className="ml-2 w-[5.8%] lg:w-[1.8%] md:w-[2.8%]"
        href="https://chain.link"
        target={"_blank"}
      >
        <img src="/images/chainlink_logo.png"></img>
      </a>

      <a
        className="ml-2 w-[7%] lg:w-[2%] md:w-[4%]"
        href="https://moralis.io"
        target={"_blank"}
      >
        <img src="/images/polygon_logo.png"></img>
      </a>

      <a
        className="ml-2 w-[7%] lg:w-[2%] md:w-[4%]"
        href="https://moralis.io"
        target={"_blank"}
      >
        <img src="/images/Moralis-1024.png"></img>
      </a>
      <a
        className="ml-2 w-[7.2%] lg:w-[2.25%] md:w-[4.25%]"
        href="https://moralis.io"
        target={"_blank"}
      >
        <img src="/images/ipfs_logo.png"></img>
      </a>
      <a
        className="ml-2 w-[7%] lg:w-[2%] md:w-[4%]"
        href="https://moralis.io"
        target={"_blank"}
      >
        <img src="/images/filecoin-fil-logo.png"></img>
      </a>
    </div>
  );
};

export default Footer;
