import { FC, useEffect } from 'react'
import { useAccount } from 'wagmi'
import TokenCard from './TokenCard'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import CardSkeleton from './CardSkeleton'
import { getTokens } from '@/lib/utils'
import SadOtter from '../assets/SadOtter.svg'



interface TokenListProps {
}

const TokenList: FC<TokenListProps> = ({ }) => {
    const account = useAccount()

    const retrieveTokens = async () => {
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

    const { data: tokens, isLoading, isError, refetch } = useQuery({ queryKey: ['tokens'], queryFn: retrieveTokens, enabled: false });

    useEffect(() => {
        refetch()
    }, [account?.chainId, account?.addresses?.[0]])

    if (isLoading) {
        return <CardSkeleton />
    }

    if (!isLoading && tokens?.length === 0) {
        return <div className='flex pt-4 items-center flex-col text-center justify-center'>
            <img src={SadOtter} alt="" />
            <p className=' font-bold text-[#7596BD]'>No Tokens found</p>
        </div>
    }


    if (isError) {
        return <div className='h-full flex justify-center items-center'>Something went wrong</div>
    }



    return (
        <div>
            {
                tokens && tokens.map((token: any) => (
                    <TokenCard key={token.address} token={token} />
                ))
            }
        </div>
    )
}

export default TokenList;