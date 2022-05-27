import React, { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import { useMoralisWeb3Api } from "react-moralis";
import { MoralisProvider } from "react-moralis";

const API_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

export default function Home() {
  const [NFTs, setNFT] = useState({});
  const Web3Api = useMoralisWeb3Api();

  const NFTMetadata = {};

  const fetchAllTokenIds = async () => {
    const options = {
      address: "0xe7348A569c4b9419e2a913b70e12D300aA718CEe",
      chain: "mumbai",
    };
    NFTMetadata = await Web3Api.token.getAllTokenIds(options);
    console.log(NFTMetadata);
    Object.keys(NFTMetadata).forEach((key) => {
      if (key === "result") {
        NFTMetadata = NFTMetadata[key];
        setNFT(NFTMetadata);
      }
    });
    console.log(NFTMetadata);
  };

  useEffect(() => {
    fetchAllTokenIds();
  }, []);

  return (
    <MoralisProvider appId={API_ID} serverUrl={SERVER_URL}>
      <div className="flex lg:flex-row flex-col bg-transparent items-center justify-evenly sm:h-[100vh] md:h-[100vh] h-screen">
        <div className="flex flex-col items-center mb-80">
          <div className=" mt-40 lg:mt-0 justify-center flex flex-row">
            <p className="lg:text-5xl text-2xl ml-28 lg:ml-0 lg:w-8 md:w-6 md:mr-48 mr-2 font-bold ">
              CREATIVITY
            </p>
            <p className="lg:text-7xl text-4xl lg:w-8 lg:ml-14 lg:-mt-4 -mt-2 mr-2 font-bold text-blue-500">
              +
            </p>
            <p className="lg:text-5xl text-2xl lg:w-8 lg:ml-10  mr-28 lg:mr-60 font-bold lg:mb-28">
              INTERACTION
            </p>
          </div>
          <div className="-mt-20">
            <text className="text-2xl mr-32 ">
              Discover new ways of creating interactive NFTs.
            </text>
          </div>
        </div>
        <div className="flex flex-row items-center items-center mb-80 lg:mb-4">
          {<NFTCard NFTs={NFTs} number={1}></NFTCard>}
        </div>
      </div>
    </MoralisProvider>
  );
}
