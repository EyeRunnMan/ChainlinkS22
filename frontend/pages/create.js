import React, { useState } from "react";
import { create as ipfsHttpClient, globSource } from "ipfs-http-client";
var all$1 = require("it-all");

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function Create() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    name: "",
    symbol: "",
    description: "",
    image: "",
    accessLink: "",
    subscriptionId: 137,
  });

  async function onChange(e) {
    if (e.target.files.length === 1) {
      const file = e.target.files[0];

      try {
        const added = await client.add(file, {
          progress: (prog) => console.log(`received: ${prog}`),
        });
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        setFileUrl(url);
        updateFormInput({ ...formInput, image: "ipfs://" + added.path });
      } catch (e) {
        console.log(e);
      }
    } else if (e.target.files.length > 1) {
      const files = e.target.files;
      try {
        var fileObjectsArray = Array.from(files).map(function (file) {
          return {
            path: file.name,
            content: file,
          };
        });
        return Promise.resolve(
          all$1(
            client.addAll(fileObjectsArray, {
              wrapWithDirectory: true,
            })
          )
        ).then(function (results) {
          for (const obj of results) {
            if (obj.path === "") {
              updateFormInput({
                ...formInput,
                accessLink: "ipfs://" + obj.cid.toString(),
              });
            }
          }
          return results;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  return (
    <div>
      <div className="w-1/4 ml-60 flex flex-col pb-12">
        <h1 className="mt-20 font-bold text-3xl">CREATE NEW ITEM</h1>
        <h4 className="mt-12 font-bold">IMAGE, VIDEO, AUDIO, OR 3D MODEL</h4>
        <h4 className="w-140 mt-2">
          File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG,
          GLB, GLTF. Max size: 100 MB
        </h4>
        <input
          type="file"
          placeholder="Asset"
          className="my-4"
          onChange={onChange}
        />
        {!fileUrl && <img src="/uploadimg.png" />}
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
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
        <h4 className="w-140 mt-2 mb-2">
          AIRNFT will include a link to this URL on this item's detail page, so
          that users can click to learn more about it. You are welcome to link
          to your own webpage with more details.
        </h4>
        <input
          directory=""
          webkitdirectory=""
          type="file"
          onChange={onChange}
        />
        <h4 className="mt-8 font-bold">DESCRIPTION</h4>
        <h4 className="w-140 mt-2">
          The description will be included on the item's detail page underneath
          its image.
        </h4>
        <input
          className="mt-4 border rounded p-4 bg-blue-form-field"
          onChange={(e) => {
            updateFormInput({ ...formInput, description: e.target.value });
          }}
        ></input>

        <button className="font-bold mt-12 mb-24 w-48 bg-blue-form-button rounded p-4 shadow-lg">
          CREATE
        </button>
      </div>
    </div>
  );
}
