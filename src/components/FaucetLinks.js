import React from 'react';
import './App.css'; 
import logo from '../logo.jpg';

const FaucetLinks = () => {
  return (
    <div className="App">
      <div className="faucet-header">
      
        <h1>Arbitrum Sepolia Faucet Links</h1>
      </div>

      <div className="container faucet-links-page">
        <ul>
          <li><a href="https://faucet.quicknode.com/arbitrum/sepolia" target="_blank" rel="noopener noreferrer">https://faucet.quicknode.com/arbitrum/sepolia</a></li>
          <li><a href="https://www.alchemy.com/faucets/arbitrum-sepolia" target="_blank" rel="noopener noreferrer">https://www.alchemy.com/faucets/arbitrum-sepolia</a></li>
          <li><a href="https://tokentool.bitbond.com/faucet/arbitrum-sepolia" target="_blank" rel="noopener noreferrer">https://tokentool.bitbond.com/faucet/arbitrum-sepolia</a></li>
          <li><a href="https://getblock.io/faucet/arb-sepolia/" target="_blank" rel="noopener noreferrer">https://getblock.io/faucet/arb-sepolia/</a></li>
        </ul>
      </div>
    </div>
  );
}

export default FaucetLinks;

