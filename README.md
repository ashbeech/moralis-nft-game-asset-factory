# `Asset Factory | v0.0.1`

### WARNING: ACTIVE WORK IN PROGRESS; CODE CURRENTLY PRE-ALPHA STAGE.

## About

Aim: More easily generate tokens, and their metadata, for games integrating NFTs as player earnable, tradable, in-game assets.

---

## Quick Launch 🚀

1. Via terminal, navigate to your local dev directory and run:

```sh
git clone https://github.com/ashbeech/moralis-nft-game-asset-factory.git

```

2. Navigate to the cloned project's root directory to install all dependencies:

```sh
npm install

```

3. Rename `.env.example` -> `.env`. Open renamed file and set all enviroment variables with your credentials.

---

## Uploading Assets ☄️

4. Place image files into their corresponding type directories e.g. `input/assets/character/image-1.png` .

NOTE: `input` and `output` directory names must conform exactly to the `types` provided in the `.env` variable file:

```javascript
// folder structure for NFT types must conform to naming converntion used here
let types = [process.env.CHAR_TYPE, process.env.ASTR_TYPE];
```

5. Via the terminal, navigate to `scripts` directory and run:

```sh
node upload.js

```

This should initiate the converting of `input` asset files to their uploadable format in the `output` directory as well as upload them and corresponding metadata to IPFS.

NOTE: Only one asset type is supported per run. Switching between `types` is on `line 61` of `scripts/metadata-upload.js`

```javascript
  // TYPE SWITCH (character: i = 0, length-1, astroid: i = 1, length)
  for (let i = 1; i < types.length; i++) {
```

6. Once assets are successfully uploaded to IPFS, the corresponding smart contract can be deployed on-chain. The contracts will use the CID returned from IPFS as reference in the constructor (as per ERC1155 standard).

Enter this CID on contract deployment into the `_uri` variable: `ipfs://INSERT_CID_HERE/{id}.json`.

```solidity
  constructor(
      address _root,
      string memory _name,
      string memory _symbol,
      string memory _uri,
      string memory _cURI,
      uint256 _expiry,
      uint256 _cost
  ) ERC1155(_uri) {
  ...
```

---

## Contract ⛓

[👷‍♂️Truffle for VSCode Extension](https://trufflesuite.com/docs/vscode-ext/) is preference for deploying, minting and testing smart contracts. A video explaining step-by-step how exactly to get your dev enviroment pipeline set-up [here on 📺YouTube](https://www.youtube.com/watch?v=rTLAkS6D7hE)

Deployment chain of preference is currently [⛓Polygon](https://docs.polygon.technology/docs/develop/hardhat/) (Mumbai testnet or mainnet).

If Truffle/Hardhat isn't available, alternatively use [ℹ️ Remix](http://remix.ethereum.org/) to deploy and run tests on functions with injected web3.

---

## Testing 🧪

[ℹ️ Block explorer](https://mumbai.polygonscan.com/)

---

## Dependencies 🏗

`ethers`: [ℹ️ Docs](https://docs.ethers.io/)

`truffle`: [ℹ️ Docs](https://trufflesuite.com/)

`ethereum-waffle`: [ℹ️ Docs](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html)

`dotenv`: [ℹ️ Docs](https://github.com/motdotla/dotenv#readme)

`moralis`: [ℹ️ Docs](https://www.npmjs.com/package/moralis)

---

## Todos ✅

- [ ] Convert to fully GUI [WIP].
