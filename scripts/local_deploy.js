const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {

  const Token = await hre.ethers.getContractFactory("MorpheusToken");
  const token = await Token.deploy();

  await token.deployed();
  console.log("Token deployed to:", token.address);

  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(token.address);

  await faucet.deployed();
  console.log("Faucet deployed to:", faucet.address);

  await token.transfer(faucet.address, tokens(1000));

  console.log("Tokens transferred  to:", faucet.address);

  // Get the balance of the faucet address
  const balance = await token.balanceOf(faucet.address);
  console.log("Balance of the faucet address:", ethers.utils.formatUnits(balance, 'ether'));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });