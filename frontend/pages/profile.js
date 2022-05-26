import React, { useState } from "react";
import AirEx from "../utils/AirEx.json";
import {
  useMoralis,
  useWeb3ExecuteFunction,
  useMoralisWeb3Api,
} from "react-moralis";
import LoadSpinner from "../components/LoadSpinner";
import Moralis from "moralis";
const ethers = Moralis.web3Library;
import truncateEthAddress from "truncate-eth-address";

export default function Profile() {
  const [formInput, updateFormInput] = useState({
    address: "",
    trait_type: "",
    trait_value: "",
  });
  const [minting, setMinting] = useState(null);
  const [NFTs, setNFT] = useState({});
  const Web3Api = useMoralisWeb3Api();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const { isAuthenticated, user, account } = useMoralis();

  const NFTMetadata = {};

  const contractProcessor = useWeb3ExecuteFunction();

  const fetchAllTokenIds = async () => {
    if (isAuthenticated) {
      const options = {
        address: account,
        chain: "mumbai",
      };
      NFTMetadata = await Web3Api.account.getNFTs(options);
      Object.keys(NFTMetadata).forEach((key) => {
        if (key === "result") {
          NFTMetadata = NFTMetadata[key];
          setNFT(NFTMetadata);
        }
      });
    }
  };

  async function mint() {
    let requestAIREXOptions = {
      abi: [
        {
          inputs: [
            {
              internalType: "string",
              name: "_traitType",
              type: "string",
            },
            {
              internalType: "string",
              name: "_traitValue",
              type: "string",
            },
          ],
          name: "requestAIREx",
          outputs: [
            {
              internalType: "uint256",
              name: "requestId",
              type: "uint256",
            },
          ],
          stateMutability: "payable",
          type: "function",
        },
      ],
      contractAddress: formInput.address,
      functionName: "requestAIREx",
      params: {
        _traitType: formInput.trait_type,
        _traitValue: formInput.trait_value,
      },
      value: 0,
    };

    let id = await contractProcessor.fetch({
      params: requestAIREXOptions,
    });
    setMinting(true);

    await delay(50000);

    let revealAIREXOptions = {
      abi: [
        {
          inputs: [],
          name: "revealAIREx",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      contractAddress: formInput.address,
      functionName: "revealAIREx",
      params: {},
    };

    let tx = await contractProcessor.fetch({
      params: revealAIREXOptions,
    });
    await delay(10000);
    setMinting(false);
  }
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <div className="lg:w-1/4 w-1/2 flex flex-col items-start lg:ml-60 ml-24">
            <h1 className="mt-20 font-bold text-3xl">
              YOUR COLLECTIONS (CONTRACTS)
            </h1>
            <div>
              {user.attributes.contractsCreated.map(function (address) {
                return (
                  <div className="mt-8 text-blue-500 font-bold">
                    <a
                      href={`https://mumbai.polygonscan.com/address/${address}`}
                      target="_blank"
                    >
                      {truncateEthAddress(address)}
                    </a>
                  </div>
                );
              })}
            </div>
            <h1 className="mt-20 font-bold text-3xl">MINT TOKEN</h1>
            <h4 className="mt-8 font-bold">COLLECTION</h4>
            <h4 className="w-140 mt-2 mb-2">
              Enter your collection's contract address
            </h4>
            <input
              className="mt-2 border-blue-500 rounded p-4 w-80 bg-blue-form-field"
              onChange={(e) => {
                updateFormInput({ ...formInput, address: e.target.value });
              }}
            ></input>
            <h4 className="mt-8 font-bold">TRAIT TYPE</h4>
            <h4 className="w-140 mt-2 mb-2">Specify a trait type string</h4>
            <input
              className="mt-2 border-blue-500 rounded p-4 w-80 bg-blue-form-field"
              onChange={(e) => {
                updateFormInput({ ...formInput, trait_type: e.target.value });
              }}
            ></input>
            <h4 className="mt-8 font-bold">TRAIT VALUE</h4>
            <h4 className="w-140 mt-2 mb-2">Specify a trait value string</h4>
            <input
              className="mt-2 border-blue-500 rounded p-4 w-80 bg-blue-form-field"
              onChange={(e) => {
                updateFormInput({ ...formInput, trait_value: e.target.value });
              }}
            ></input>
            {!minting ? (
              <button
                onClick={mint}
                className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold px-4 py-2 mb-20 rounded w-40 mt-14 lg:mt-14"
              >
                Mint NFT
              </button>
            ) : (
              <div className="-mt-24 mb-14">
                <LoadSpinner />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-screen">
          <p className="ml-[30%] lg:ml-[40%] mt-20 text-xl lg:text-3xl">
            Please connect your wallet
          </p>
        </div>
      )}
    </div>
  );
}
