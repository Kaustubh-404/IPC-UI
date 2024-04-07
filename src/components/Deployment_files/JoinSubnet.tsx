import React, { useState } from 'react';
import { useAddresses } from '../context/AddressContext';
import Select from "./1";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
} from "../ui/table";

interface Address {
  address: string;
}

interface Subnet {
  subnetId: string;
}

interface JoinRecord {
  address: string;
  subnetId: string;
  initialBalance: string;
}

interface JoinSubnetProps {}

const JoinSubnet: React.FC<JoinSubnetProps> = () => {
  const { addressData, subnetData } = useAddresses();
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedSubnet, setSelectedSubnet] = useState<string>('');
  const [initialBalance, setInitialBalance] = useState<string>('');
  const [joinStatus, setJoinStatus] = useState<string>('');
  const [joinRecords, setJoinRecords] = useState<JoinRecord[]>([]);

  const handleJoinSubnet = async () => {
    setJoinStatus('Joining subnet...');
    try {
      const response = await fetch('http://localhost:3100/join-subnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          validatorAddress: selectedAddress,
          subnetAddress: selectedSubnet,
          initialBalance: initialBalance
        }),
      });
      if (response.ok) {
        const result = await response.text();
        setJoinRecords((prevJoinRecords) => [...prevJoinRecords, { address: selectedAddress, subnetId: selectedSubnet, initialBalance }]);
        setJoinStatus(`Successfully joined subnet: ${result}`);
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      setJoinStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {joinStatus && <div className="alert">{joinStatus}</div>}
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
          placeholder="Select Subnet"
        />
      </div>
      <div className="form-group">
        <Input
          type="number"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          placeholder="Initial Balance"
        />
      </div>
      <Button onClick={handleJoinSubnet}>Join Subnet</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Subnet ID</TableHead>
            <TableHead>Initial Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {joinRecords.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.address}</TableCell>
              <TableCell>{record.subnetId}</TableCell>
              <TableCell>{record.initialBalance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JoinSubnet;