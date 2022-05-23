const Asset = artifacts.require("AssetFactory");

module.exports = async function (deployer) {
  await deployer.deploy(
    Asset, // Asset Factory contract
    "0x5B3e180e42b5E702C5A090A79D6B05152d4fd2a2", // <-- this is address to be admin/contract owner
    "Character", // <-- Asset name
    "CHAR", // <-- Asset symbol
    "ipfs://QmWqrRjHyJFifurKnP67JKHM8fNwQXEsBLPfpmEViDEqME/character/metadata/{id}.json", // <-- Asset URI to metadata
    "ipfs://QmczFcJvf8vYficMPp8uZ6b31QKiZMLky6EvFREcVWUK4R/characters.json", // <-- Asset type-level metadata
    3600, // <-- Expiry time
    179211 ^ 12 // <-- Cost for player to claim each asset
  );

  let assetInstance = await Asset.deployed();
  let uri = await assetInstance.getContractURI();
  console.log("Deployed Contract URI: ", uri);
};
