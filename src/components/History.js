import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = ({ walletAddress, apiKey }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    console.log('apiKey:', apiKey);
    console.log('walletAddress:', walletAddress);

    try {
      const response = await axios.get(
        `https://arb-sepolia.g.alchemy.com/v2/${apiKey}/getAssetTransfers`,
        {
          params: {
            fromAddress: walletAddress,
            category: ['external', 'erc20'],
            withMetadata: true,
            order: 'desc',
          },
        }
      );
      setTransactions(response.data.transfers);
    } catch (error) {
      console.error('Error fetching transactions:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [walletAddress, apiKey]);

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            {tx.hash} - {tx.asset} - {tx.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
