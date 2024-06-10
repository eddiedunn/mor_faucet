const hre = require("hardhat");


async function main() {

    const Token = await hre.ethers.getContractFactory("MorpheusToken");
    const token = await Token.deploy();

    await token.deployed();
    console.log("Token deployed to:", token.address);

    const Faucet = await hre.ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy(token.address);

    await faucet.deployed();

    console.log("Faucet deployed to:", faucet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });