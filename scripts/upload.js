// import dependencies
const fs = require("fs");
const console = require("console");
const dotenv = require("dotenv");
dotenv.config(); // setup dotenv

// utilise Moralis
const Moralis = require("moralis/node");

// import config
const {
  description,
  baseImageUri,
  startEditionFrom,
} = require("../input/config.js");

// import metadata
const { compileMetadata } = require("../src/metadata");

// import for saving files
const { formatFile } = require("../src/filesystem");

// Moralis creds
const serverUrl = process.env.MORALIS_SERVER_URL;
const appId = process.env.MORALIS_APP_ID;
const masterKey = process.env.MORALIS_MASTER_KEY;
const apiUrl = process.env.IPFS_API_URL;
const apiKey = process.env.IPFS_API_KEY;

// Start Moralis session
Moralis.start({ serverUrl, appId, masterKey });

// Create generative art by using the canvas api
const init = async () => {
  console.log("");
  console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░");
  console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░");
  console.log("░░░░░░░░Oo...°°°°°°..oO░░░░Ooo.........oO░░░░░░░░░");
  console.log("░░░░░░o.°°°°°°°°°°°°°°°.oo.°°°°°°°°°°°°°°.oO░░░░░░");
  console.log("░░░░o°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°......°°.O░░░░");
  console.log("░░░o°°°°°°°°°°°°°°°°°°°°°°°°°°°.....°°........O░░░");
  console.log("░░o°°°°°°°°°.OO░░░Oo°°°°°°..°.OO░░░OO..........O░░");
  console.log("░░.°°°°°°°°o░░░░░░░░O.°.....o░░░░░░░░░o........o░░");
  console.log("░░.°°°°°°°.░░░░░░░░░░O.....o░░░░░░░░░░O........o░░");
  console.log("░░o°°°°°°°.░░░░░░░░░░░░OOOO░░░░░░░░░░░o........o░░");
  console.log("░░░.°°°°°°°O░░░░░░░░░░░░░░░░░░░░░░░░░O.........░░░");
  console.log("░░░O.°°°°...O░░░░░░░░░░░░░░░░░░░░░░░O.........O░░░");
  console.log("░░░░░.°......O░░░░░░░░░░░░░░░░░░░░Oo.ooooooo.O░░░░");
  console.log("░░░░░░O.......o░░░░░░░░░░░░░░░░░OoooooooooooO░░░░░");
  console.log("░░░░░░░░O.......O░░░░░░░░░░░░░OooooooooooooO░░░░░░");
  console.log("░░░░░░░░░░OOoooo░░░░░░░░░░░░░OoooooooooooO░░░░░░░░");
  console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░OoooooooooO░░░░░░░░░░");
  console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░OOoooOO░░░░░░░░░░░░");
  console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░");
  console.log("░░░░░░            Asset Factory             ░░░░░░");
  console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░");

  // folder structure for NFT types must conform to naming converntion used here
  let types = [process.env.CHAR_TYPE, process.env.ASTR_TYPE];

  const fsPromises = fs.promises;

  const collectionSize = async (_prefix) => {
    let _asset_dir = `./input/assets/${_prefix}/images/`;
    try {
      return await fsPromises.readdir(_asset_dir);
    } catch (err) {
      console.error("ERROR 0000: ", err);
    }
  };

  let files = [];
  let size = 0;
  let type = "";
  // TYPE SWITCH (character: i = 0, length-1, astroid: i = 1, length)
  for (let i = 1; i < types.length; i++) {
    // num of input files = collection size
    files[`${types[i]}`] = await collectionSize(types[i]);
    // check for hidden files and remove
    if (files[`${types[i]}`][0] == ".DS_Store") {
      files.splice(0, 1);
    }

    console.log();
    size = size + files[`${types[i]}`].length - 1;
    console.log("Payload: %d", size, files);
    type = types[i];
    console.log("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░");

    // image data collection
    let imageDataArray = [];

    // create NFTs from startEditionFrom to size
    let id = startEditionFrom;

    console.log();
    while (id <= size) {
      console.log("  Compiling %d of %d", id, size);
      console.log("–––––––––––––––––––––––––––––––––––––––––––––––––––");

      const localCompile = async () => {
        // take image files in assets dir and rename to format with 64 leading 0's.
        // return object array of data associated with corresponding image file
        [...imageDataArray] = await formatFile(
          type,
          files,
          id,
          size,
          imageDataArray
        );
      };

      await localCompile();

      id++;
    }

    // take image file data, upload images, compile metadata, upload metadata
    await compileMetadata(apiUrl, apiKey, size, imageDataArray);
  }
};

// start complie -> upload process
init();
