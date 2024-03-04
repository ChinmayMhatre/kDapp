import { FC } from 'react'
import TransactionCard from './TransactionCard';
import { useQuery } from '@tanstack/react-query';
import { getAllTransactions } from '@/lib/api';

interface MyTransactionsProps {
    chainId?: any
    address?: string
    token?: string
}

const MyTransactions: FC<MyTransactionsProps> = ({ address,chainId,token }) => {


    const { data, isLoading, isError} = useQuery({ queryKey: ['transactions',address,chainId], queryFn: getAllTransactions});

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error</div>
    }
    

    return (
        <div className='flex flex-col gap-2 overflow-y-scroll h-[40vh] w-full'>
            {
                data?.data.result.map((transaction:any) => {
                    return <TransactionCard key={transaction.tx_hash} transaction={transaction} token={token} userAddress={address} />
                })
            
            }
        </div>
    )
}

export default MyTransactions;