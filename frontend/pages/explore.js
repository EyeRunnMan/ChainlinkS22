import React, { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { MoralisProvider } from "react-moralis";
import NFTCard from "../components/NFTCard";

const API_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

export default function Explore() {
  const [NFTs, setNFT] = useState({});
  const Web3Api = useMoralisWeb3Api();

  const NFTMetadata = {};

  // const { user } = useMoralis();

  // const addresses = user.attributes.contractsCreated;

  const fetchAllTokenIds = async () => {
    // for (const contractAddress of addresses) {
    // console.log(contractAddress);
    const options = {
      // address: `${contractAddress}`,
      address: "0xe7348A569c4b9419e2a913b70e12D300aA718CEe",
      chain: "mumbai",
    };
    NFTMetadata = await Web3Api.token.getAllTokenIds(options);
    Object.keys(NFTMetadata).forEach(async (key) => {
      if (key === "result") {
        NFTMetadata = NFTMetadata[key];
        setNFT(NFTMetadata);
      }
    });
    // }

    // const result = await Web3Api.token.getTokenIdMetadata({
    //   address: "0xe7348A569c4b9419e2a913b70e12D300aA718CEe",
    //   token_id: 1,
    //   flag: "metadata",
    // });
    // console.log(result);
    // console.log(NFTMetadata);
  };

  useEffect(() => {
    fetchAllTokenIds();
  }, []);

  return (
    <MoralisProvider appId={API_ID} serverUrl={SERVER_URL}>
      <div className="lg:h-screen">
        <div className="flex flex-col items-center justify-evenly lg:mt-24">
          {<NFTCard NFTs={NFTs} number={"all"}></NFTCard>}
        </div>
      </div>
    </MoralisProvider>
  );
}
