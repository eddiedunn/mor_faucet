//import React from 'react';
import './App.css';
import logo from '../logo.jpg';

import FAUCET_ABI from '../abis/Faucet.json'
import TOKEN_ABI from '../abis/MorpheusToken.json'

function App() {
  return (
    <div className="App">
      <header>
        <button className="connect-wallet">Connect Wallet</button>
      </header>
      <div className="container">
        <img src={logo} alt="sMOR Token Faucet Logo" className="logo" />
        <h1>sMOR Token Faucet</h1>
        <div className="input-section">
          <input type="text" placeholder="Enter Your Wallet Address (0x)" />
          <button><span>Send Me sMOR</span></button>
        </div>
        <p className="info">Receive 10 sMOR every 24 hours</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Wallet Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2023-06-11</td>
              <td>10 sMOR</td>
              <td>0x1234567890abcdef</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;