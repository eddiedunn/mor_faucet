import { useEffect, useState } from 'react';
import '@walletconnect/react-native-compat'
import { Web3Wallet } from '@walletconnect/web3wallet';
import { Core } from '@walletconnect/core'
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
  const [chainId, setChainId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const initWallet = async () => {
    const core = new Core({
      projectId: process.env.REACT_APP_WALLECT_CONNECT_PROJECT_ID
    })
    const web3wallet = await Web3Wallet.init({
      core,
      metadata: {
        name: "sMOR faucet"
      }
    });

    web3wallet.on('session_proposal', async (proposal) => {
      const session = await web3wallet.approveSession({
        id: proposal.id,
        namespaces: proposal.namespaces
      });
      const ethersProvider = new ethers.providers.Web3Provider(web3wallet.provider);
      setProvider(ethersProvider);
      const accounts = await ethersProvider.listAccounts();
      const network = await ethersProvider.getNetwork();
      setAccount(accounts[0]);
      setChainId(network.chainId);
    });

    web3wallet.on('disconnect', () => {
      console.log('Wallet disconnected');
      setProvider(null);
      setAccount(null);
      setChainId(null);
    });
  };

  const requestTokens = async () => {
    if (!provider) {
      setErrorMessage('Wallet not connected.');
      return;
    }
    try {
      const signer = provider.getSigner();
      const faucet = new ethers.Contract(config[chainId].faucet.address, FAUCET_ABI, signer);
      const tx = await faucet.requestTokens();
      await tx.wait();
      console.log('Tokens requested successfully!');
      setErrorMessage('');
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

  useEffect(() => {
    initWallet();
  }, []);

  return (
    <div className="App">
      <header>
        <button onClick={initWallet} className="connect-wallet">
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
