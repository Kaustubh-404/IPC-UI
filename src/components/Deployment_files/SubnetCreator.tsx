import React, { useState } from 'react';
import { useAddresses } from '../context/AddressContext';
import Select from './1';
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

interface SubnetData {
  address: string;
  subnetId: string;
}

const SubnetCreator: React.FC = () => {
  const { addressData, subnetData, setSubnetData } = useAddresses();
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [minValidatorStake, setMinValidatorStake] = useState<number>(1);
  const [minValidators, setMinValidators] = useState<number>(1);
  const [manualSubnetId, setManualSubnetId] = useState<string>('');
  const [joinStatus, setJoinStatus] = useState<string>('');

  const createSubnet = async () => {
    setJoinStatus('creating subnet...');
    try {
      const response = await fetch('http://localhost:3100/create-subnet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minValidatorStake: minValidators,
          minValidators: minValidatorStake,
          from: selectedAddress,
        }),
      });

      if (response.ok) {
        const subnetId = await response.text();
        setSubnetData((prevSubnetData: SubnetData[]) => [...prevSubnetData, { address: selectedAddress, subnetId }]);
        setJoinStatus(`Created subnet successfully `);
      } else {
        alert('Failed to create subnet');
        setJoinStatus(`""`);
      }
    } catch (error) {
      setJoinStatus(`Error: ${error.message}`);
    }
  };

  const handleManualAddition = () => {
    if (manualSubnetId && selectedAddress) {
      setSubnetData((prevSubnetData: SubnetData[]) => [...prevSubnetData, { address: selectedAddress, subnetId: manualSubnetId }]);
      setManualSubnetId('');
    } else {
      alert('Please select an address and enter a subnet ID.');
    }
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="address-select">Address</label>
        <Select
          id="address-select"
          options={addressData.map(({ address }) => ({ value: address, label: address }))}
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
          placeholder="Select an Address"
        />
      </div>
      <div className="form-group">
        <label htmlFor="min-validator-stake">Min Validator Stake (tfil)</label>
        <Input
          id="min-validator-stake"
          type="number"
          min="1"
          max="10"
          value={minValidatorStake}
          onChange={(e) => setMinValidatorStake(Number(e.target.value))}
          placeholder="Min Validator Stake"
        />
      </div>

      <div className="form-group">
        <label htmlFor="min-validators">Min Validators  </label>
        <Input
          id="min-validators"
          type="number"
          min="1"
          max="10"
          value={minValidators}
          onChange={(e) => setMinValidators(Number(e.target.value))}
          placeholder="Min Validators"
        />
      </div>
      <Button onClick={createSubnet}>Create Subnet</Button> {joinStatus && <div className="alert">{joinStatus}</div>}

      {/* Input for manual subnet ID addition */}
      <div className="mt-4">
        <Input
          type="text"
          value={manualSubnetId}
          onChange={(e) => setManualSubnetId(e.target.value)}
          placeholder="Supply Subnet ID if one Already Created"
        />
        <Button className="mt-2" onClick={handleManualAddition}>Add Manual Subnet</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Subnet ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subnetData.map(({ address, subnetId }, index) => (
            <TableRow key={index}> {/* Using index as key due to potential duplicate subnet IDs */}
              <TableCell>{address}</TableCell>
              <TableCell>{subnetId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default SubnetCreator;