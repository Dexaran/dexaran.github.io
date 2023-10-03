export const renderShortAddress = (address: string, symbols = 4) =>
  address && `${address.substring(0, symbols + 2)}...${address.substring(42 - symbols, 42)}`;

export const renderShortHash = (hash: string, symbols = 4) =>
  hash && `${hash.substring(0, symbols + 2)}...${hash.substring(66 - symbols, 66)}`;

export const roundValue = (value = 0, count = 4) => {
  return Math.round(value * Math.pow(10, count)) / Math.pow(10, count);
};
  
