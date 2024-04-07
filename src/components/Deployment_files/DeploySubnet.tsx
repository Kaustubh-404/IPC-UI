import React, { useState } from 'react';
import { useAddresses } from '../context/AddressContext';
import Select from './1';
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
} from "../ui/table";
import MetaMaskNetworkButton from './MetaMaskNetworkButton';

interface DeployRecord {
  'Subnet ID': string;
  'Eth API': string;
  'Chain ID': string;
  'Fendermint API': string;
  'CometBFT API': string;
  'CometBFT node ID': string;
  'CometBFT P2P': string;
  'IPLD Resolver Multiaddress': string;
}

interface DeploySubnetProps {}

const DeploySubnet: React.FC<DeploySubnetProps> = () => {
  const { addressData, subnetData } = useAddresses();
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedSubnet, setSelectedSubnet] = useState<string>('');
  const [deployStatus, setDeployStatus] = useState<string>('');
  const [deployRecords, setDeployRecords] = useState<DeployRecord[]>([]);

  const handleDeployNode = async () => {
    setDeployStatus('Deploying node...');
    try {
      const response = await fetch('http://localhost:3100/deploy-first-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: selectedAddress,
          subnetId: selectedSubnet,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setDeployRecords((prevDeployRecords) => [...prevDeployRecords, result]);
        setDeployStatus('Successfully deployed node.');
      } else {
        throw new Error('Deployment failed');
      }
    } catch (error) {
      setDeployStatus(`Error: ${error.message}`);
    }
  };

  const fetchMockData = async () => {
    setDeployStatus('Fetching mock data...');
    try {
      const response = await fetch('http://localhost:3100/mock-deploy-data');
      if (response.ok) {
        const mockData = await response.json();
        setDeployRecords([mockData]);
        setDeployStatus('Mock data fetched successfully.');
      } else {
        throw new Error('Failed to fetch mock data');
      }
    } catch (error) {
      setDeployStatus(`Error fetching mock data: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {deployStatus && <div className="alert">{deployStatus}</div>}
      <div className="form-group">
        <Select
          options={addressData.map(({ address }) => ({ value: address, label: address }))}
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
          placeholder="Select Address"
        />
      </div>
      <div className="form-group">
        <Select
          options={subnetData.map(({ subnetId }) => ({ value: subnetId, label: subnetId }))}
          value={selectedSubnet}
          onChange={(e) => setSelectedSubnet(e.target.value)}
          placeholder="Select Subnet "
        />
      </div>
      <Button onClick={handleDeployNode}>Deploy Node</Button>
      <Button onClick={fetchMockData}>MockData</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subnet ID</TableHead>
            <TableHead>Eth API</TableHead>
            <TableHead>Chain ID</TableHead>
            <TableHead>Fendermint API</TableHead>
            <TableHead>CometBFT API</TableHead>
            <TableHead>CometBFT node ID</TableHead>
            <TableHead>CometBFT P2P</TableHead>
            <TableHead>IPLD Resolver Multiaddress</TableHead>
            <TableHead>Add to MetaMask</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deployRecords.map((record, index) => (
            <TableRow key={index}>
              <TableCell className="break-words  max-w-xs">{record['Subnet ID']}</TableCell>
              <TableCell className="break-words break-all max-w-xs">{record['Eth API']}</TableCell>
              <TableCell className="break-words break-all max-w-xs">{record['Chain ID']}</TableCell>
              <TableCell className="break-words break-all max-w-xs">{record['Fendermint API']}</TableCell>
              <TableCell className="break-words break-all max-w-xs">{record['CometBFT API']}</TableCell>
              <TableCell className="break-words break-all max-w-xs">{record['CometBFT node ID']}</TableCell>
              <TableCell className="break-words break-all max-w-xs">{record['CometBFT P2P']}</TableCell>
              <TableCell className="break-words  break-all max-w-xs">{record['IPLD Resolver Multiaddress']}</TableCell>
              <TableCell>
                <MetaMaskNetworkButton
                  subnetId={record['Subnet ID']}
                  rpcUrl={record['Eth API']}
                  chainId={record['Chain ID']}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeploySubnet;