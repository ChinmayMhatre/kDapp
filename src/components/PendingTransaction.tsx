import React, { FC, useEffect, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { formatAddress } from '@/lib/utils';
import { serialize, useReadContract, useReadContracts, useTransaction } from 'wagmi';
import { decodeFunctionData, erc20Abi, formatEther, formatGwei } from 'viem';

interface PendingTransactionProps {
    hash: any,
    payload: any
}

const PendingTransaction: FC<PendingTransactionProps> = ({ hash, payload }) => {
    const [transactionArgs, setTransactionArgs] = useState([])
    const [isNativeToken, setIsNativeToken] = useState(true)

    let transaction = useTransaction({
        hash: hash,
        query: {
            refetchInterval: 2000,
            enabled: true
        }
    })

    const decodeTokenData = () => {
        if(transaction?.data?.input === '0x'){
            setIsNativeToken(true)
            return
        }  
        if(transaction?.data?.input.length > 2){
            setIsNativeToken(false)
            const { args } = decodeFunctionData({
                abi: erc20Abi,
                data: transaction?.data?.input,
            })
            setTransactionArgs(args)
        }
    }
    // console.log(transactionArgs != undefined && BigInt(transactionArgs[1]),'transactionArgs');
    
    const coinData = useReadContract({
        address: transaction?.data?.to,
        abi: erc20Abi,
        functionName:'name',
    })

    const coinDecimal = useReadContract({
        address: transaction?.data?.to,
        abi: erc20Abi,
        functionName:'decimals',
    })

    console.log(transactionArgs,'transactionArgs');
    

    console.log(coinDecimal,'coinDecimal');
    
    
    console.log(coinData,'coinData');
    

    console.log(transaction);
    
    useEffect(() => {
        if(!transaction?.isLoading){
            decodeTokenData()
        }
        coinData.refetch()
    }
        , [transaction.status])

    if (transaction.isLoading) {
        return (
            <AlertDialog open={true}>
                Loading
            </AlertDialog>
        )
    }




    return (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {/* <div className="flex justify-evenly items-center">
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <p>From</p>
                                <p>{formatAddress(String(data?.from))}</p>
                            </div>
                            <div className="">{'->'}</div>
                            <div className=" flex flex-col justify-center items-center gap-2">
                                <p>To</p>
                                <p>{formatAddress(String(data?.to))}</p>
                            </div>
                        </div> */}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {/* <div className="flex flex-col gap-2 ">
                            <h2>Transaction</h2>
                            <div className="flex justify-between items-center">
                                <p>Hash</p>
                                <p>{formatAddress(data?.hash)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Amount</p>
                                <p>{formatEther(data?.value)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Gas Limit (Units)</p>
                                <p>{data?.gas}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Gas Price (Gwei)</p>
                                <p>{formatGwei(data?.gasPrice)}</p>
                            </div>

                        </div> */}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PendingTransaction;