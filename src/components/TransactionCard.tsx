import React, { FC } from 'react'
import { formatEther, formatGwei } from 'viem';
import { formatAddress } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface TransactionCardProps {
    transaction: any
    token: any
    userAddress: any
}

const TransactionCard: FC<TransactionCardProps> = ({ transaction, token, userAddress }) => {
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
                        {formatEther(transaction.value)} {token}
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
                                <p>{formatAddress(String(transaction?.to_address))}</p>
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