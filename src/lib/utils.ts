import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
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

export const getTokens = async (response:any): Promise<TokenData[]> => {
  let tokenData: TokenData[] = [];
  try {

      response?.map((token: any) => {
        let tempData = {
          balance: '',
          name: '',
          symbol: '',
          logo: '',
          address: '',
          decimals:0
        };
        tempData.name = token.name
        tempData.symbol = token.symbol
        tempData.logo = token.logo
        tempData.address = token.token_address
        tempData.balance = convertToEther(token.balance, token.decimals)
        tempData.decimals = token.decimals
        tokenData.push(tempData)
      })
    } catch (error) {
      console.log(error);
    }
    return tokenData;
}