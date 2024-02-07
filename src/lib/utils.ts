import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Alchemy, Network } from 'alchemy-sdk'
import axios from 'axios';
import { useAccount, useBalance } from "wagmi";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface TokenData {
  balance: string,
  name: string,
  symbol: string,
  logo: string,
  address: string
}

export const convertToEther = (wei: string, decimals: number) => {

  if (wei.length > decimals) {
    return wei.slice(0, -decimals) + '.' + wei.slice(-decimals);
  } else {
    return '0.' + wei.padStart(decimals, '0');
  }
}

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const getTokens = async (chainId: number, address: string): Promise<TokenData[]> => {
  let tokenData: TokenData[] = [];

  try {
    const response = await axios.get(`https://deep-index.moralis.io/api/v2.2/${address}/erc20`, {
      params: {
        'chain': `0x${chainId}`
      },
      headers: {
        'accept': 'application/json',
        'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY
      }
    });
    if (response.status === 200) {

      response.data.map(async (token: any) => {
        let tempData = {
          balance: '',
          name: '',
          symbol: '',
          logo: '',
          address: ''
        };
        tempData.name = token.name
        tempData.symbol = token.symbol
        tempData.logo = token.logo
        tempData.address = token.token_address
        tempData.balance = convertToEther(token.balance, token.decimals)

        tokenData.push(tempData)

      })
    }
    return tokenData;
  } catch (error) {
    console.log(error);
    return tokenData;
  }


  // alchemy method
  // let tokenData;
  // if (chainId === 1) {
  //   alchemyChain = Network.ETH_MAINNET
  // } else if (chainId === 11155111) {
  //   alchemyChain = Network.ETH_SEPOLIA
  // } else if (chainId === 5) {
  //   alchemyChain = Network.ETH_GOERLI
  // }
  // const config = {
  //   apiKey: "0UV3-1Zvlz2IfUC5kMXugjEJXBbDnLqe",
  //   network: alchemyChain,
  // };

  // const alchemy = new Alchemy(config);

  // try {
  // const balances = await alchemy.core.getTokenBalances(address);
  // balances.tokenBalances.map(async (token) => {

  //   const metadata = await alchemy.core.getTokenMetadata(token.contractAddress)
  //   let balance = BigInt(token?.tokenBalance).toString()
  //   const decimals:any = metadata.decimals

  //   // Insert the decimal point at the correct position


  //   console.log(metadata.name, balance)
  // })

  // console.log(metadata);

  //   console.log(balances);

  // } catch (error) {
  //   console.log(error);

  // }
}