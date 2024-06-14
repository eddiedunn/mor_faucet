import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import logo from '../logo.jpg';
import FAUCET_ABI from '../abis/Faucet.json';
import config from '../config.json';
import History from './History';
import { Link } from 'react-router-dom';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chainId, setChainId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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
        alert('No Ethereum wallet detected. Install MetaMask!');
      }
    } catch (error) {
      console.error('Failed to connect wallet', error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setChainId(null);
    console.log('Wallet disconnected');
  };

  const requestTokens = async () => {
    try {
      console.log('Requesting tokens...');
      const signer = provider.getSigner();
      const faucet = new ethers.Contract(config[chainId].faucet.address, FAUCET_ABI, signer);
      const tx = await faucet.requestTokens();
      await tx.wait();
      console.log('Tokens requested successfully!');
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error requesting tokens:', error);
      const errorText = error.message;
      if (errorText.includes('Insufficient time elapsed since last withdrawal')) {
        setErrorMessage('Insufficient time elapsed since last withdrawal - Please try again later.');
      } else {
        setErrorMessage('An error occurred while requesting tokens.');
      }
    }
  };

  const setupProvider = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const network = await provider.getNetwork();
      setChainId(network.chainId);
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
      return accounts;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await setupProvider();
      setIsLoading(false);
    };
    if (isLoading) {
      initialize();
    }
  }, [isLoading]);

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        if (accounts[0] !== account) {
          await connectWallet();
        }
      } else {
        disconnectWallet();
      }
      console.log('Account changed:', accounts[0]);
    };

    const handleChainChanged = async () => {
      await setupProvider();
      setIsLoading(true);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    window.addEventListener('beforeunload', disconnectWallet);

    return () => {
      window.removeEventListener('beforeunload', disconnectWallet);
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [account]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const accounts = await setupProvider();
      if (accounts && accounts[0] !== account) {
        setAccount(accounts[0]);
        console.log('Account changed:', accounts[0]);
      }
    }, 1000);
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
          <button onClick={requestTokens}><span>Send Me sMOR</span></button>
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <p className="address">
          Token Address: <span className="info">0xc1664f994Fd3991f98aE944bC16B9aED673eF5fD</span>
        </p>
        <p className="info">Receive 10 sMOR every 24 hours</p>
        <Link to="/faucet-links" className="faucet-links">
          Arbitrum Sepolia Faucet Links
        </Link>
        {/* {account && <History walletAddress={String(account)} apiKey={process.env.REACT_APP_ALCHEMY_API_KEY} />} */}
      </div>
    </div>
  );
}

export default App;
