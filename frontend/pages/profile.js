import React, { useState } from "react";
import AirEx from "../utils/AirEx.json";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import Moralis from "moralis";
const ethers = Moralis.web3Library;
import truncateEthAddress from "truncate-eth-address";

export default function Profile() {
  const [formInput, updateFormInput] = useState({
    address: "",
    trait_type: "",
    trait_value: "",
  });
  const { isAuthenticated, user } = useMoralis();
  const { ethereum } = window;
  const ABI = AirEx.abi;
  const bytecode = AirEx.bytecode;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    "0x7043390b0d6f39614133aB82e8f49574A177E56e",
    ABI,
    signer
  );
  const deployed = contract.attach(user.attributes.contractsCreated[0]);

  const contractProcessor = useWeb3ExecuteFunction();
  console.log(deployed);

  async function mint() {}
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
              className="mt-2 border-blue-500 rounded p-4 w-80 bg-blue-form-field mb-14"
              onChange={(e) => {
                updateFormInput({ ...formInput, trait_value: e.target.value });
              }}
            ></input>
            <button
              onClick={mint}
              className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded w-40 mb-20 mt-20 lg:mt-0"
            >
              Mint NFT
            </button>
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
