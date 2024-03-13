import axios from "axios";
import { getTokens } from "./utils";


export const retrieveTokens = async ({ queryKey }: any) => {
    const [_, account] = queryKey
    console.log(account?.chainId);
    
    const response = await axios.get(`https://deep-index.moralis.io/api/v2.2/${account?.addresses?.[0]}/erc20`, {
        params: {
            'chain': `${account?.chainId == 11155111 ? "sepolia" : `0x${account?.chainId}`}`
        },
        headers: {
            'accept': 'application/json',
            'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY
        }
    });
    const temp = await getTokens(response.data)
    return temp
}

export const getAllTransactions = async ({ queryKey }: any) => {
    const [_, address, chainId] = queryKey
    const response = await axios.get(`https://deep-index.moralis.io/api/v2.2/${address}`, {
        params: {
            'chain': `${chainId == 11155111 ? "sepolia" : `0x${chainId}`}`,
            'order': 'DESC'
        },
        headers: {
            'accept': 'application/json',
            'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY
        }
    });
    return response
}