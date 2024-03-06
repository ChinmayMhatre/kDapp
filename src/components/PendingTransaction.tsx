import React, { FC, useEffect, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { formatAddress } from '@/lib/utils';
import { serialize, useReadContract, useReadContracts, useSendTransaction, useTransaction } from 'wagmi';
import { decodeFunctionData, erc20Abi, formatEther, formatGwei, parseEther } from 'viem';
import { Loader2 } from 'lucide-react';

interface PendingTransactionProps {
    hash: any,
    payload: any
    chainId: number | undefined
    nativeToken: string
    userAddress: string
}

const PendingTransaction: FC<PendingTransactionProps> = ({ hash, payload, chainId, nativeToken, userAddress }) => {
    
    const [valueData, setValueData] = useState({
        value: "",
        symbol: "",
    })
    const [isOpen, setIsOpen] = useState(true)
    const [toAddress, setToAddress] = useState("")

    console.log(hash, 'hash');
    
    const transaction = useTransaction({
        hash: hash,
        query: {
            refetchInterval: 2000,
            enabled: true,
        }
    })

    console.log(transaction, 'tx loading')

    const coinNameContract = {
        address: transaction?.data?.to,
        abi: erc20Abi,
        functionName: 'name' as 'name',
    }

    const coinDecimalContract = {
        address: transaction?.data?.to,
        abi: erc20Abi,
        functionName: 'decimals' as "decimals",
    } as const

    const coinDataFetch = useReadContracts({
        contracts: [
            { ...coinNameContract },
            { ...coinDecimalContract }
        ],
        query: {
            enabled: false
        }
    })


    const fetchTokenData = () => {
        console.log(transaction?.data?.chainId, chainId, 'chainId');
        console.log(transaction?.data?.from, userAddress, 'userAddress');


        if (transaction?.data?.chainId != chainId) {
            setIsOpen(false)    
            return
        }
        if (transaction?.data?.from != userAddress.toLowerCase()) {
            setIsOpen(false)
            return
        }
        
        if (transaction?.data?.blockHash != null) {
            localStorage.removeItem(`${userAddress}`)
            setIsOpen(false)
        }
        if (transaction?.data?.input === '0x') {
            setToAddress(transaction?.data?.to)
            setValueData({
                value: formatEther(transaction?.data?.value),
                symbol: nativeToken
            })
        }
        else {
            coinDataFetch.refetch()
            const { args } = decodeFunctionData({
                abi: erc20Abi,
                data: transaction?.data?.input,
            })
            setToAddress(args[0] as string)
            console.log(args, coinDataFetch);

            const coinName = coinDataFetch?.data?.[0]?.result
            const coinValue = Number(args[1]?.toString()) / 10 ** Number(coinDataFetch?.data?.[1]?.result)

            console.log(coinValue, 'coinValue');
            setValueData({
                value: coinValue.toString(),
                symbol: coinName as string
            })

        }
    }
    
    
    
    const updateTransaction = () => {  
        // useSendTransaction(payload)
        console.log(payload);
        

    }

    useEffect(() => {
        console.log(transaction.data, 'transaction');
        if (!transaction?.isLoading) {
            fetchTokenData()
        }

    }
        , [transaction.isFetching])

    if (transaction.isLoading) {
        return (
            <AlertDialog open={true}>
                Loading
            </AlertDialog>
        )
    }



    console.log(transaction);
    

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <>
                        <div className="flex justify-center pb-4 flex-col gap-2 items-center">
                        <Loader2 className="mr-2 h-10 w-10 animate-spin" />
                        <p>Sending Transaction</p>
                        </div>
                        <div className="flex justify-evenly items-center">
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <p>From</p>
                                <p>{formatAddress(String(transaction?.data?.from))}</p>
                            </div>
                            <div className="">{'->'}</div>
                            <div className=" flex flex-col justify-center items-center gap-2">
                                <p>To</p>
                                <p>{formatAddress(toAddress)}</p>
                            </div>
                        </div>
                        </>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="flex flex-col gap-2 ">
                            <h2>Transaction</h2>
                            <div className="flex justify-between items-center">
                                <p>Hash</p>
                                <a href={`https://goerli.etherscan.io/tx/${transaction?.data?.hash}`} target='_blank'>{ transaction?.data?.hash && formatAddress(transaction?.data?.hash)}</a>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Amount</p>
                                <p>{valueData.value === 'NaN' ? "..." : valueData.value} {valueData.symbol}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Tx Fee (Ether)</p>
                                <p>{transaction?.data?.gasPrice &&(parseFloat(transaction?.data?.gas?.toString()) * Number(formatEther(transaction?.data?.gasPrice, 'wei')))}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Gas (Units)</p>
                                <p>{transaction?.data?.gas && transaction?.data?.gas?.toString()}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Gas Price (Gwei)</p>
                                <p>{transaction?.data?.gasPrice && formatGwei(transaction?.data?.gasPrice)}</p>
                            </div>

                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={updateTransaction}>Speed Up Transaction</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PendingTransaction;