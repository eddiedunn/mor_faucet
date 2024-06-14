import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './App.css';
import logo from '../logo.jpg';

import FAUCET_ABI from '../abis/Faucet.json';

// Config
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [chainId, setChainId] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const network = await provider.getNetwork();
        setChainId(network.chainId);
      } else {
        alert("No Ethereum wallet detected. Install MetaMask!");
      }
    } catch (error) {
      console.error("Failed to connect wallet", error);
      //alert("Failed to connect wallet");
    }
  };

  const requestTokens = async (walletAddress) => {
    try {
      console.log('Requesting tokens...');
      console.log('Chain ID:', chainId);
      console.log('Faucet Address:', config[chainId].faucet.address);

      const signer = provider.getSigner();
      const faucet = new ethers.Contract(config[chainId].faucet.address, FAUCET_ABI, signer);

      const tx = await faucet.requestTokens();
      await tx.wait();

      console.log('Tokens requested successfully!');
    } catch (error) {
      console.error('Error requesting tokens:', error);
    }
  };

  const loadBlockchainData = async () => {
    try {
      console.log('Loading blockchain data...');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      console.log('Provider:', provider);

      const network = await provider.getNetwork();
      console.log('Network:', network);
      const chainId = network.chainId;
      console.log('Chain ID:', chainId);
      setChainId(chainId);

      await connectWallet();

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading blockchain data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('Accounts changed:', accounts);
        setAccount(accounts[0]);
      });

      window.ethereum.on('chainChanged', async () => {
        console.log('Chain changed');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const network = await provider.getNetwork();
        setChainId(network.chainId);
        setIsLoading(true); // Trigger a reload of blockchain data
      });
    }
  }, []);

  useEffect(() => {
    const checkAccountAndChain = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
        const network = await provider.getNetwork();
        if (network.chainId !== chainId) {
          setChainId(network.chainId);
          setIsLoading(true); // Trigger a reload of blockchain data
        }
      }
    };

    const interval = setInterval(checkAccountAndChain, 1000);
    return () => clearInterval(interval);
  }, [account, chainId]);

  return (
    <div className="App">
      <header>
        <button className="connect-wallet" onClick={connectWallet}>
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </header>
      <div className="container">
        <img src={logo} alt="sMOR Token Faucet Logo" className="logo" />
        <h1>sMOR Token Faucet</h1>
        <div className="input-section">
          <button onClick={() => requestTokens(walletAddress)}><span>Send Me sMOR</span></button>
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
