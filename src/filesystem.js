const fs = require("fs");
// create image files and return back image object array
const formatFile = async (_type, files, id, collectionSize, imageDataArray) => {
  let attributesList = [];
  let promiseArray = [];

  // output dirs
  var dirs = [
    `./output`,
    `./output/${_type}`,
    `./output/${_type}/images`,
    `./output/${_type}/metadata`,
  ];

  const checkDirs = async (_dir) => {
    for (let i = 0; i < dirs.length; i++) {
      promiseArray.push(
        new Promise((res, rej) => {
          if (!fs.existsSync(_dir[i])) {
            fs.mkdirSync(_dir[i], { recursive: true });
          }
        })
      );
    }
    // once all promises back then save to IPFS (and Moralis database)
    Promise.all(promiseArray)
      .then((res) => {
        console.log("DONNE");
        return true;
      })
      .catch((err) => {
        console.log("ERROR 0004: ", err);
        return false;
      });
  };

  const copyFile = async (__id, _type, _inputFile, _outputFile) => {
    fs.copyFile(
      `./input/assets/${_type}/images/${_inputFile}`,
      `./output/${_type}/images/${_outputFile}`,
      (err) => {
        if (err) throw err;
        console.log(` Success: Input file ${__id} copied to output dir`);
        console.log("–––––––––––––––––––––––––––––––––––––––––––––––––––");
      }
    );
    return true;
  };

  let inputFile = files[`${_type}`][id - 1];
  let _id = id.toString();
  let paddedHex = (
    "0000000000000000000000000000000000000000000000000000000000000000" + _id
  ).slice(-64);
  let outputFile = paddedHex + ".png";

  // check output directories exist
  await checkDirs(dirs);
  // copy and format asset files over to output
  await copyFile(_id, _type, inputFile, outputFile);

  // save and return image data
  imageDataArray[id] = {
    id: id,
    input: inputFile,
    output: outputFile,
    path: "",
    icid: "",
    type: _type,
  };

  return imageDataArray;
};

module.exports = {
  formatFile,
};
