const Asset = artifacts.require("AssetFactory");

module.exports = async function (deployer) {
  await deployer.deploy(
    Asset,
    "0x5B3e180e42b5E702C5A090A79D6B05152d4fd2a2",
    "Character",
    "CHAR",
    "ipfs://QmZskehSajzYQ96KacrfgtUSCKwdLoPF3mFLuotaLkqFHH/character/metadata/{id}.json",
    "ipfs://QmczFcJvf8vYficMPp8uZ6b31QKiZMLky6EvFREcVWUK4R/characters.json",
    3600,
    179211 ^ 12
  );

  let assetInstance = await Asset.deployed();
  let uri = await assetInstance.getContractURI();
  console.log("Deployed Contract URI: ", uri);
};
