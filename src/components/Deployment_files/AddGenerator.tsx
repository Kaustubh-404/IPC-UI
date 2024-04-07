import React, { useState } from 'react';
import { Button } from "../ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHeader,
    TableFooter,
    TableHead,
    TableRow,
  } from "../ui/table";
  import { Input } from "../ui/input"
  import { useAddresses } from '../context/AddressContext';

interface AddressData {
  address: string;
  publicKey?: string;
}

const AddGenerator: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const { addressData, setAddressData } = useAddresses();
  const [publicKeyCache, setPublicKeyCache] = useState<{ [key: string]: string }>({});
  const [newAddress, setNewAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateAddress = async () => {
    setLoading(true);

    const response = await fetch('http://localhost:3100/generate-eth-address');
    const addressWithQuotes  = await response.text();
    const trimmedAddress = addressWithQuotes.trim();
    const address = trimmedAddress.replace(/^"|"$/g, '');

    setAddressData((prevData) => [...prevData, { address, publicKey: null }]);
    setLoading(false);
  };

  const handleManualAddition = (newAddress: string) => {
    setAddressData((prevData) => [...prevData, { address: newAddress, publicKey: null }]);
  };

  const togglePublicKey = async (address: string) => {
    const targetIndex = addressData.findIndex((item) => item.address === address);
    const cachedPublicKey = publicKeyCache[address];

    if (cachedPublicKey !== undefined) {
      setAddressData((prevData) =>
        prevData.map((item, idx) =>
          idx === targetIndex ? { ...item, publicKey: item.publicKey ? null : cachedPublicKey } : item
        )
      );
    } else {
      const response = await fetch(`http://localhost:3100/generate-public-address?ethAddress=${address}`);
      const publicKeyWithQuotes = await response.text();
      const publicKey = publicKeyWithQuotes.replace(/^"|"$/g, '');

      setAddressData((prevData) =>
        prevData.map((item, idx) =>
          idx === targetIndex ? { ...item, publicKey } : item
        )
      );

      setPublicKeyCache((prevCache) => ({ ...prevCache, [address]: publicKey }));
    }
  };

  return (
    <>
      <Button onClick={generateAddress} disabled={loading}>
        {loading ? 'Generating Address...' : 'Generate Address'}
      </Button>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter address"
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <Button onClick={() => handleManualAddition(newAddress)}>Add Address</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Public Key</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addressData.map(({ address, publicKey }) => (
            <TableRow key={address}>
              <TableCell>{address}</TableCell>
              <TableCell className="break-words max-w-xs">
                {publicKey && <p>{publicKey}</p>}
              </TableCell>
              <TableCell>
                <Button onClick={() => togglePublicKey(address)}>
                  {publicKey ? 'Hide Public Key' : 'Show Public Key'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AddGenerator;