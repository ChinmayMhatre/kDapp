import React, { FC } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { formatEther, formatGwei } from 'viem';
import { formatAddress } from '@/lib/utils';

interface TransactionCardProps {
    transaction: any
    token: any
    userAddress: string
}

const TransactionCard: FC<TransactionCardProps> = ({ transaction, token, userAddress }) => {
    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
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
                        {formatEther(transaction.value)} {token}
                    </p>
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <div className="flex justify-evenly items-center">
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <p>From</p>
                                <p>{formatAddress(String(transaction?.from_address))}</p>
                            </div>
                            <div className="">{'->'}</div>
                            <div className=" flex flex-col justify-center items-center gap-2">
                                <p>To</p>
                                <p>{formatAddress(String(transaction?.to_address))}</p>
                            </div>
                        </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
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
                                <p>{formatEther(transaction.value)} {token}</p>
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
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {/* <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter> */}
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default TransactionCard;