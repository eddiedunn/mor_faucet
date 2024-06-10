// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MorpheusToken is ERC20 {
  // set the initial supply to 42 million like in whitepaper
  uint256 constant initialSupply = 42_000_000 * (10 ** 18);

  constructor() ERC20("Morpheus dev", "MOR") {
    _mint(msg.sender, initialSupply);
  }
}