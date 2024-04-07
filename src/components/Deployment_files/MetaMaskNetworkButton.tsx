import React from 'react';
import { Button } from "../ui/button";

interface MetaMaskNetworkButtonProps {
  subnetId: string;
  rpcUrl: string;
  chainId: string | number;
}

const MetaMaskNetworkButton: React.FC<MetaMaskNetworkButtonProps> = ({ subnetId, rpcUrl, chainId }) => {
  const addNetwork = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');

      const networkName = `subnet ${subnetId.substring(10, 20)}`;

      const hexChainId = `0x${(Number(chainId)).toString(16)}`;
      const hmm = rpcUrl.replace(/^http:/, 'https:');

      const params = {
        chainId: hexChainId,
        chainName: networkName,
        nativeCurrency: {
          name: 'FIL',
          symbol: 'FIL',
          decimals: 18,
        },
        rpcUrls: [hmm],
      };

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
    } catch (error) {
      console.error('Error adding network to MetaMask:', error);
      alert(error.message);
    }
  };

  return (
    <Button onClick={addNetwork} className="button-class">Add to MetaMask</Button>
  );
};

export default MetaMaskNetworkButton;