import React, { createContext, useContext, useState } from 'react';

interface AddressContextData {
  addressData: any[];
  setAddressData: React.Dispatch<React.SetStateAction<any[]>>;
  subnetData: any[];
  setSubnetData: React.Dispatch<React.SetStateAction<any[]>>;
}

const AddressContext = createContext<AddressContextData>({
  addressData: [],
  setAddressData: () => {},
  subnetData: [],
  setSubnetData: () => {},
});

export const useAddresses = () => useContext(AddressContext);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addressData, setAddressData] = useState<any[]>([]);
  const [subnetData, setSubnetData] = useState<any[]>([]);

  const contextValue = {
    addressData,
    setAddressData,
    subnetData,
    setSubnetData,
  };

  return (
    <AddressContext.Provider value={contextValue}>
      {children}
    </AddressContext.Provider>
  );
};