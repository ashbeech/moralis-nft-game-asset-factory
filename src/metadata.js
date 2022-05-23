const fs = require("fs");
const Moralis = require("moralis/node");
const { default: axios } = require("axios");
const { description, baseImageUri } = require("../input/config.js");
const { nameGenerator, attributeGenerator } = require("./generator.js");

// write metadata locally to json files
const writeReferenceMetadata = async (_type, _metadataList) => {
  fs.writeFileSync(
    `./output/${_type}/metadata_ref.json`,
    JSON.stringify(_metadataList)
  );
};

// add metadata for individual nft edition
const composeMetadata = (
  _id,
  _name,
  _description,
  _type,
  _edition,
  _icid,
  _attributesList,
  _path,
  _extras
) => {
  let dateTime = Date.now();
  let tempMetadata = {
    id: _id,
    name: `${_name}`,
    description: _description,
    type: _type,
    image: _path || baseImageUri,
    edition: _edition,
    icid: _icid,
    date: dateTime,
    attributes: _attributesList,
  };
  if (_type == "asteroid") {
    tempMetadata.model_url =
      "https://gateway.moralisipfs.com/ipfs/QmUXC4KqRKnFXEMbRUPXnG1W2w8JWqVcBk93vtWa6yHhSA/asteroid.fbx";
    tempMetadata.animation_url =
      "https://gateway.moralisipfs.com/ipfs/QmUXC4KqRKnFXEMbRUPXnG1W2w8JWqVcBk93vtWa6yHhSA/asteroid.mp4";
    tempMetadata.external_url = `http://mydomain.io/game/lore?id=${_id}`;
    if (_extras != "") {
      tempMetadata.spatial = _extras;
    }
  } else {
    tempMetadata.model_url =
      "https://gateway.moralisipfs.com/ipfs/QmUXC4KqRKnFXEMbRUPXnG1W2w8JWqVcBk93vtWa6yHhSA/character.fbx";
    tempMetadata.animation_url =
      "https://gateway.moralisipfs.com/ipfs/QmUXC4KqRKnFXEMbRUPXnG1W2w8JWqVcBk93vtWa6yHhSA/character.mp4";
    tempMetadata.badge_url =
      "https://gateway.moralisipfs.com/ipfs/QmUXC4KqRKnFXEMbRUPXnG1W2w8JWqVcBk93vtWa6yHhSA/badge-engineering.png";
    tempMetadata.evac_url =
      "https://gateway.moralisipfs.com/ipfs/QmUXC4KqRKnFXEMbRUPXnG1W2w8JWqVcBk93vtWa6yHhSA/evac_id.png";
    tempMetadata.external_url = `http://mydomain.io/game/lore?id=${_id}`;
  }
  return tempMetadata;
};

// upload metadata
const uploadMetadata = async (
  apiUrl,
  xAPIKey,
  imageCID,
  collectionSize,
  imageDataArray
) => {
  const ipfsArray = []; // holds all IPFS data
  const metadataList = []; // holds metadata for all NFTs (could be a session store of data)
  const promiseArray = []; // array of promises so that only if finished, will next promise be initiated
  let type = "";
  let spatial = "";

  for (let i = 1; i < collectionSize + 1; i++) {
    if (i == 1) {
      type = imageDataArray[i].type;
    }
    let name = await nameGenerator(type);
    let desc = await attributeGenerator(
      imageDataArray[i].id,
      Date.now(),
      type,
      "desc"
    );
    let attributes = await attributeGenerator(
      imageDataArray[i].id,
      Date.now(),
      type,
      ""
    );

    if (type == "asteroid") {
      spatial = await attributeGenerator(
        imageDataArray[i].id,
        Date.now(),
        type,
        "spatial"
      );
    }

    let _id = i.toString();
    let paddedHex = (
      "0000000000000000000000000000000000000000000000000000000000000000" + _id
    ).slice(-64);
    let filename = i.toString() + ".json";
    imageDataArray[i].name = name;
    imageDataArray[i].icid = imageCID;
    imageDataArray[
      i
    ].path = `https://gateway.moralisipfs.com/ipfs/${imageCID}/${imageDataArray[i].type}/images/${paddedHex}.png`;

    // do something else here after firstFunction completes
    let nftMetadata = composeMetadata(
      imageDataArray[i].id,
      imageDataArray[i].name,
      desc,
      imageDataArray[i].type,
      imageDataArray[i].id,
      imageDataArray[i].icid,
      attributes,
      imageDataArray[i].path,
      spatial
    );
    metadataList.push(nftMetadata);

    // upload metafile data to Moralis
    const metaFile = new Moralis.File(filename, {
      base64: Buffer.from(
        JSON.stringify(metadataList.find((meta) => meta.edition == i))
      ).toString("base64"),
    });

    // save locally as file
    fs.writeFileSync(
      `./output/${imageDataArray[i].type}/metadata/${filename}`,
      JSON.stringify(metadataList.find((meta) => meta.edition == i))
    );

    // reads output folder for json files and then adds to IPFS object array
    promiseArray.push(
      new Promise((res, rej) => {
        fs.readFile(
          `./output/${imageDataArray[i].type}/metadata/${_id}.json`,
          (err, data) => {
            if (err) rej();
            ipfsArray.push({
              path: `${imageDataArray[i].type}/metadata/${paddedHex}.json`,
              content: data.toString("base64"),
            });
            res();
          }
        );
      })
    );
  }

  // once all promises back then save to IPFS (and Moralis database)
  Promise.all(promiseArray).then(() => {
    axios
      .post(apiUrl, ipfsArray, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          "X-API-Key": xAPIKey,
          "content-type": "application/json",
          accept: "application/json",
        },
      })
      .then((res) => {
        let metaCID = res.data[0].path.split("/")[4];

        const cleanup = async (_total) => {
          console.log("  Success: Payload delivered");
          console.log("  - %d images uploaded to IPFS [%s]", _total, imageCID);
          console.log("  - %d metadata files generated [%s]", _total, metaCID);
          console.log();
          console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░");
          console.log("░░░░░░            End Transmission           ░░░░░░");
          console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░");
          console.log();
        };

        cleanup(imageDataArray.length - 1);
        //console.log(" META FILE PATHS:", res.data);

        // write a compiled version of all the metadata for IPFS location reference
        writeReferenceMetadata(type, metadataList);
      })
      .catch((err) => {
        console.log("ERROR 0001: ", err);
      });
  });
};

// compile metadata (reads output folder images)
const compileMetadata = async (
  apiUrl,
  xAPIKey,
  collectionSize,
  imageDataArray
) => {
  ipfsArray = [];
  promiseArray = [];

  let id = imageDataArray.length - 1;

  for (let i = 1; i <= id; i++) {
    type = imageDataArray[id].type;
    let _id = i.toString();
    let paddedHex = (
      "0000000000000000000000000000000000000000000000000000000000000000" + _id
    ).slice(-64);

    // reads output folder for images and adds to IPFS object metadata array (within promise array)
    promiseArray.push(
      new Promise((res, rej) => {
        fs.readFile(`./output/${type}/images/${paddedHex}.png`, (err, data) => {
          if (err) rej();
          ipfsArray.push({
            path: `${type}/images/${paddedHex}.png`,
            content: data.toString("base64"),
          });
          res();
        });
      })
    );
  }
  // once all promises then upload IPFS object metadata array
  Promise.all(promiseArray).then(() => {
    axios
      .post(apiUrl, ipfsArray, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          "X-API-Key": xAPIKey,
          "content-type": "application/json",
          accept: "application/json",
        },
      })
      .then((res) => {
        let imageCID = res.data[0].path.split("/")[4];
        // pass folder CID to meta data
        uploadMetadata(
          apiUrl,
          xAPIKey,
          imageCID,
          collectionSize,
          imageDataArray
        );
      })
      .catch((err) => {
        console.log("ERROR 0002: ", err);
      });
  });
};

module.exports = {
  composeMetadata,
  writeReferenceMetadata,
  uploadMetadata,
  compileMetadata,
};
