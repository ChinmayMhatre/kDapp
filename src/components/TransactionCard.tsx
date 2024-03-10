import React, { FC, useEffect, useState } from 'react'
import { decodeFunctionData, erc20Abi, formatEther, formatGwei } from 'viem';
import { formatAddress } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useReadContracts } from 'wagmi';

interface TransactionCardProps {
    transaction: any
    token: any
    userAddress: any
}

const TransactionCard: FC<TransactionCardProps> = ({ transaction, token, userAddress }) => {
    const [toAddress, setToAddress] = useState("")
    const [transactionDataLoading, setTransactionDataLoading] = useState(false)
    const [valueData, setValueData] = useState({
        value: "",
        symbol: "",
    })

    const coinNameContract = {
        address: transaction?.to_address,
        abi: erc20Abi,
        functionName: 'name' as 'name',
    }

    const coinDecimalContract = {
        address: transaction?.to_address,
        abi: erc20Abi,
        functionName: 'decimals' as "decimals",
    } as const

    const coinDataFetch = useReadContracts({
        contracts: [
            { ...coinNameContract },
            { ...coinDecimalContract }
        ]
    })


    const fetchTokenData = () => {
        if (transaction?.input === '0x') {
            setToAddress(transaction?.to)
            setValueData({
                value: formatEther(transaction?.value),
                symbol: token
            })
        }
        else {
            setTransactionDataLoading(true)
            const { args } = decodeFunctionData({
                abi: erc20Abi,
                data: transaction?.input,
            })
            setToAddress(args[0] as string)
            console.log(coinDataFetch?.data, 'args');
            
            const coinName = coinDataFetch?.data?.[0]?.result
            const coinValue = Number(args[1]?.toString()) / 10 ** Number(coinDataFetch?.data?.[1]?.result)

            setValueData({
                value: coinValue,
                symbol: coinName as string
            })
            
            setTransactionDataLoading(false)
        }
    }

    useEffect(() => {
        fetchTokenData()
    }, [transaction,coinDataFetch.data])
    

    if (transactionDataLoading) {
        return <div>Loading...</div>
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className='w-full p-4 rounded-lg flex justify-between items-center border shadow-sm'>
                    <div>

                        {
                            transaction.from_address === userAddress.toLowerCase() ?
                                <p className=' font-bold'>
                                    Sent
                                </p> :
                                <p className='  font-bold'>
                                    Received
                                </p>
                        }
                    </div>
                    <p>
                        {valueData.value} {valueData.symbol}
                    </p>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex justify-evenly items-center">
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <p>From</p>
                                <p>{formatAddress(String(transaction?.from_address))}</p>
                            </div>
                            <div className="">{'->'}</div>
                            <div className=" flex flex-col justify-center items-center gap-2">
                                <p>To</p>
                                <p>{formatAddress(String(toAddress))}</p>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col gap-2 ">
                            {/* <div className="flex justify-between items-center">
                                <p className=' text-lg'>from :</p>
                                <p>
                                    {transaction?.from_address}
                                </p>
                            </div> */}
                            <h2>Transaction</h2>
                            <div className="flex justify-between items-center">
                                <p>Nonce</p>
                                <p>{transaction.nonce}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Amount</p>
                                <p>{valueData.value && valueData?.value} {valueData?.symbol}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Gas Limit (Units)</p>
                                <p>{transaction.gas}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Gas Price (Gwei)</p>
                                <p>{formatGwei(transaction.gas_price)}</p>
                            </div>

                        </div>
                    </DialogDescription>
                </DialogHeader>
                {/* <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}

export default TransactionCard;