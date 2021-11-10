export function noop() { };

export const formatAddress = (address: string = '', firstPartDigits = 6) => {
  const start = address.substring(0, firstPartDigits);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
};
