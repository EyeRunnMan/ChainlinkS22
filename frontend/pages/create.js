import React, { useState } from "react";
// import { create as ipfsHttpClient } from "ipfs-http-client";
import { Web3Storage } from "web3.storage";
import Moralis from "moralis";
import { useMoralis, useMoralisQuery } from "react-moralis";
import AirEx from "../utils/AirEx.json";
import { useRouter } from "next/router";
const ethers = Moralis.web3Library;

//const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_API_KEY });

export default function Create() {
  const { isAuthenticated, user } = useMoralis();
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    name: "",
    symbol: "",
    description: "",
    image: "",
    accessLink: "",
    subscriptionId: 137,
  });
  const router = useRouter();

  const User = Moralis.Object.extend("_User");

  async function onSubmit(e) {
    const { ethereum } = window;
    const ABI = AirEx.abi;
    const bytecode = AirEx.bytecode;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const factory = new ethers.ContractFactory(ABI, bytecode, signer);
    console.log(factory);

    const notNull = Object.values(formInput).every((value) => {
      if (value !== null || value !== undefined || value !== "") {
        return true;
      }
      return false;
    });

    console.log(notNull);

    if (notNull) {
      const contract = await factory.deploy(
        formInput.name,
        formInput.symbol,
        formInput.description,
        formInput.image,
        formInput.accessLink,
        formInput.subscriptionId
      );
      console.log([
        formInput.name,
        formInput.symbol,
        formInput.description,
        formInput.image,
        formInput.accessLink,
        formInput.subscriptionId,
      ]);
      console.log(contract.address, contract.deployTransaction);
      if (user.attributes.contractsCreated === undefined) {
        user.save([], {
          onSuccess: (user) => {
            user.set("contractsCreated", []);
          },
        });
      }
      user.addUnique("contractsCreated", contract.address);
      user.save();
    }
  }

  async function onChange(e) {
    console.log(user);
    if (e.target.files.length === 1) {
      //const file = e.target.files[0];

      try {
        // const added = await client.add(file, {
        //   progress: (prog) => console.log(`received: ${prog}`),
        // });
        // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        // setFileUrl(url);
        // updateFormInput({ ...formInput, image: "ipfs://" + added.path });
        const cid = await client.put(e.target.files, {
          wrapWithDirectory: false,
        });
        updateFormInput({ ...formInput, image: "ipfs://" + cid });
        const url = `https://ipfs.infura.io/ipfs/${cid}`;
        setFileUrl(url);
      } catch (e) {
        console.log(e);
      }
    } else if (e.target.files.length > 1) {
      const files = e.target.files;
      try {
        // var fileObjectsArray = Array.from(files).map(function (file) {
        //   return {
        //     path: file.name,
        //     content: file,
        //   };
        // });
        // return Promise.resolve(
        //   all$1(
        //     client.addAll(fileObjectsArray, {
        //       wrapWithDirectory: true,
        //     })
        //   )
        // ).then(function (results) {
        //   for (const obj of results) {
        //     if (obj.path === "") {
        //       updateFormInput({
        //         ...formInput,
        //         accessLink: "ipfs://" + obj.cid.toString(),
        //       });
        //     }
        //   }
        //   return results;
        // });
        const cid = await client.put(files);
        updateFormInput({ ...formInput, accessLink: "ipfs://" + cid });
      } catch (e) {
        // return Promise.reject(e);
        console.log(e);
      }
    }
  }

  return (
    <div>
      {isAuthenticated ? (
        <div className="lg:w-1/4 w-1/2 lg:ml-60 ml-24 -mt-8 lg:mt-0 flex flex-col pb-12">
          <h1 className="mt-20 font-bold text-3xl">CREATE NEW COLLECTION</h1>
          <h4 className="mt-12 font-bold">IMAGE, VIDEO, AUDIO, OR 3D MODEL</h4>
          <h4 className="w-140 mt-2 text-gray-600">
            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG,
            GLB, GLTF.
          </h4>
          <input
            type="file"
            placeholder="Asset"
            className="my-4"
            onChange={onChange}
          />
          {!fileUrl && <img src="/uploadimg.png" />}
          {fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )}
          <h4 className="mt-8 font-bold">NAME</h4>
          <input
            className="mt-2 border-blue-500 rounded p-4 bg-blue-form-field"
            onChange={(e) => {
              updateFormInput({ ...formInput, name: e.target.value });
            }}
          ></input>
          <h4 className="mt-8 font-bold">SYMBOL</h4>
          <input
            className="mt-2 border-blue-500 rounded p-4 bg-blue-form-field"
            onChange={(e) => {
              updateFormInput({ ...formInput, symbol: e.target.value });
            }}
          ></input>
          <h4 className="mt-8 font-bold">EXTERNAL LINK</h4>
          <h4 className="w-140 mt-2 mb-2 text-gray-600">
            Upload your game folder that will be used to deploy a new instance
            of the AIRNFT smart contract, letting you mint randomized NFTs from
            this collection.
          </h4>
          <input
            directory=""
            webkitdirectory=""
            type="file"
            onChange={onChange}
          />
          <h4 className="mt-8 font-bold">DESCRIPTION</h4>
          <h4 className="w-140 mt-2 text-gray-600">
            Include details about the collection
          </h4>
          <input
            className="mt-4 border rounded p-4 bg-blue-form-field"
            onChange={(e) => {
              updateFormInput({ ...formInput, description: e.target.value });
            }}
          ></input>

          <button
            className="font-bold mt-12 mb-24 lg:w-48 sm:w-24 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-600 hover:to-orange-600 text-white rounded p-4 shadow-lg"
            onClick={onSubmit}
          >
            CREATE
          </button>
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
