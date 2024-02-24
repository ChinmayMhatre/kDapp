import { FC } from 'react'
import TransactionCard from './TransactionCard';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';



interface MyTransactionsProps {
    chainId?: any
    address?: string
    token?: string
}

const MyTransactions: FC<MyTransactionsProps> = ({ address,chainId,token }) => {
    
    console.log(chainId);
    
    
    const getAllTransactions = async () => {
        const response = await axios.get(`https://deep-index.moralis.io/api/v2.2/${address}`, {
          params: {
            'chain': `0x${chainId}`,
            'order': 'DESC'
          },
          headers: {
            'accept': 'application/json',
            'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY
          }
        });
        return response
    }

    const { data, isLoading, isError} = useQuery({ queryKey: ['transactions'], queryFn: getAllTransactions});

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error</div>
    }

    console.log(data?.data.result[0]);
    

    return (
        <div className='flex flex-col gap-2 overflow-y-scroll h-[40vh] w-full'>
            {
                data?.data.result.map((transaction:any) => {
                    return <TransactionCard key={transaction.tx_hash} transaction={transaction} token={token} />
                })
            
            }
        </div>
    )
}

export default MyTransactions;