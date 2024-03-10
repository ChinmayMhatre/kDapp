import { FC, useEffect, useState } from 'react'
import TransactionCard from './TransactionCard';
import { useQuery } from '@tanstack/react-query';
import { getAllTransactions } from '@/lib/api';
import { decodeFunctionData, erc20Abi } from 'viem';

interface MyTransactionsProps {
    chainId?: any
    address?: string
    token?: string
}

const MyTransactions: FC<MyTransactionsProps> = ({ address,chainId,token }) => {
    const [transactionData, setTransactionData] = useState<any>([])
    const [dataLoading, setDataLoading] = useState(false);
    

    const { data, isLoading, isError} = useQuery({ queryKey: ['transactions',address,chainId], queryFn: getAllTransactions});

    const filterTransactions = (transactions:any) => {
        setDataLoading(true)
        console.log(transactions);
        transactions.map((transaction:any) => {
            if (transaction?.input === '0x') {
                setTransactionData((prev:any)=> [...prev, { ...transaction}])
                return
            }
        try {
            const { args } = decodeFunctionData({
                abi: erc20Abi,
                data: transaction?.input,
            })
            setTransactionData((prev:any)=> [...prev, { ...transaction}])
        } catch (error) {
        }
    })
    setDataLoading(false)
    }

    useEffect(() => {
      if(!isLoading){
        filterTransactions(data?.data.result)
      }
    }, [data?.data.result])
    


    if (dataLoading || isLoading) {
        return <div>Loading...</div>
    }

    if (transactionData.length === 0 && !isLoading) {
        return <div className='flex justify-center'>No transactions found</div>
    }

    if (isError) {
        return <div>Error</div>
    }

    

    return (
        <div className='flex flex-col gap-2 overflow-y-scroll h-[40vh] w-full'>
            {
                transactionData.map((transaction:any) => {
                    return <TransactionCard key={transaction.tx_hash} transaction={transaction} token={token} userAddress={address} />
                })
            
            }
        </div>
    )
}

export default MyTransactions;