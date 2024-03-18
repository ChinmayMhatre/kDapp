import { FC, useEffect, useState } from 'react'
import MainLayout from './components/MainLayout';
import { Button } from "@/components/ui/button"
import { useBalance, useWriteContract } from 'wagmi'
import { useAccount } from 'wagmi';
import { useSendTransaction } from 'wagmi'
import { isAddress, parseEther } from 'viem';

import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom';
import { convertToEther } from './lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from './components/ui/select';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { retrieveTokens } from './lib/api';
import PendingTransaction from './components/PendingTransaction';
import Otter from './assets/Otter.svg';


interface SendTransactionProps {

}


const SendTransaction: FC<SendTransactionProps> = ({ }) => {
    const [senderAddress, setSenderAddress] = useState<any>("")
    const [selectedToken, setSelectedToken] = useState<any>("ETH")
    const [nativeToken, setNativeToken] = useState<any>({
        name: "ETH",
        balance: "0.00"
    })
    const [amount, setAmount] = useState("")
    const [amountError, setAmountError] = useState("")
    const [error, setError] = useState("")
    const account = useAccount()
    const navigate = useNavigate()

    const { writeContract } = useWriteContract()

    if (account.isDisconnected) {
        navigate('/login')
    }

    const balance = useBalance({ address: account?.addresses?.[0] })

    useEffect(() => {
        if (balance.isSuccess) {
            const intBalance = BigInt(balance.data?.value ?? 0).toString()
            const ethBalance = convertToEther(intBalance, balance?.data?.decimals)
            console.log(nativeToken, 'nativeToken');
            
            setNativeToken({
                name: balance.data?.symbol,
                balance: ethBalance
            })
        }
    }, [balance.isSuccess])



    const { data: tokens, isLoading, refetch } = useQuery({ queryKey: ['tokens', account], queryFn: retrieveTokens, enabled: false });

    useEffect(() => {
        refetch()
    }, [account?.chainId, account?.addresses?.[0]])

    const { sendTransaction } = useSendTransaction()


    console.log(tokens);
    

    const displayTokenBalance = () => {
        console.log(selectedToken, nativeToken.name, 'selectedToken');
        
        if (selectedToken === nativeToken.name) {
            return Number(nativeToken.balance).toFixed(4)
        }
        return Number(tokens?.find((el) => el.symbol === selectedToken)?.balance).toFixed(4)
    }


    const handleAmount = (e: any) => {
        setAmountError("")
        const currentToken = tokens?.find((el) => el.symbol === selectedToken)
        setAmount(e.target.value)

        if (selectedToken === nativeToken?.name) {
            if (e.target.value > Number(nativeToken.balance)) {
                setAmountError("Amount exceeded")
            }
            return
        }
        if (e.target.value > Number(currentToken?.balance)) {
            setAmountError("Amount exceeded")
        }
    }


    const handleSendTransaction = async () => {
        setError("")
        if (!isAddress(senderAddress)) {
            setError("Invalid address")
            return
        }
        if (amountError.length > 0) {
            return
        }

        if (selectedToken === nativeToken.name) {
            toast('Sending Transaction')
            sendTransaction({
                to: senderAddress,
                value: parseEther(amount),
                gas: BigInt(21000),
            }, {
                onSuccess: (data) => {
                    const newTransaction = {
                        payload: {
                            to: senderAddress,
                            value: amount,
                            gas: BigInt(21000).toString()
                        },
                        hash: data,
                        chainId : account?.chainId
                    }
                    localStorage.setItem(`${account?.address}`, JSON.stringify(newTransaction))
                    location.reload()
                },
                onError: (error) => {
                    console.log(error);

                    toast('Error sending transaction')
                }
            })
            return
        } else {

            //  get the token address of the selected token
            const tokenDetails = tokens?.find((el) => el.symbol === selectedToken)

            const payload = {
                chainId: account.chainId,
                address: tokenDetails?.address,
                functionName: 'transfer',
                args: [senderAddress, BigInt(Number(amount) * 10 ** (tokenDetails?.decimals ?? 0))],
                abi: [{ "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }],
                gas: BigInt(43500),
            }
            // @ts-ignore 
            writeContract(payload, {
                onSuccess: (data) => {
                    const storePayload = {
                        chainId: account.chainId,
                        gas: BigInt(43500).toString(),
                        address: tokenDetails?.address,
                        functionName: 'transfer',
                        args: [senderAddress, BigInt(Number(amount) * 10 ** (tokenDetails?.decimals ?? 0)).toString()],
                        abi: [{ "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]
                    }
                    const newTransaction = {
                        payload: storePayload,
                        hash: data,
                        chainId : account?.chainId
                    }
                    localStorage.setItem(`${account?.address}`, JSON.stringify(newTransaction))
                    location.reload()
                },
                onError: (error) => {
                    console.log(error);

                    toast('Error sending transaction')
                }
            }
            )
        }

    }



    if (account.isConnecting || isLoading) {
        return <MainLayout>
            <div className="flex flex-col h-full text-center justify-center items-center">
                <img src={Otter} className=' w-14 h-14 ' alt="" />
                <p className=' text-xl font-bold'>Loading</p>
            </div>
        </MainLayout>
    }


    return (
        <MainLayout>
            <div className=" h-full flex flex-col gap-4 py-4">
                <div className=" grid grid-cols-4 justify-between items-center">
                    <div className="flex">
                        <Link to="/" className=' p-1 rounded-full hover:bg-slate-100 transition-all duration-200'><ChevronLeft className=" h-6 w-6" /></Link>
                    </div>
                    <p className=" text-lg text-center col-span-2 ">Send Transaction</p>
                </div>
                <div className=" border border-gray-400 rounded-lg p-2 flex flex-col justify-center items-center gap-1">
                    <p className='text-lg font-bold'>{account.chain?.name}</p>
                    <p className=' text-sm'> <span className=' text-gray-500 font-bold text-xs'>Balance: </span> {Number(nativeToken.balance).toFixed(4)} {nativeToken.name} </p>
                </div>
                <Input placeholder="Enter the sender's address" value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} />
                <Select value={selectedToken} onValueChange={(value: any) => setSelectedToken(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Token" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={nativeToken.name}>{nativeToken.name}</SelectItem>
                        {
                            tokens && tokens.map((token) => (
                                <SelectItem key={token.address} value={token.symbol}>{token.symbol}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                <p>Balance: {displayTokenBalance()}</p>
                <div className="flex font-semibold text-[#4E5C6B] justify-center items-center">
                    Amount
                </div>
                <Input placeholder={`0.0 ${selectedToken}`} value={amount} className=' outline-none border-0 p-0 text-4xl  text-center' type='number' onChange={(e) => handleAmount(e)} />
                <p className=' text-red-700 text-sm'>{amountError}</p>
                <Button className='w-full' onClick={() => handleSendTransaction()}>Send</Button>
                <div className="">
                    {error}
                </div>
            </div>
            <PendingTransaction userAddress={account.address as string} chainId={account?.chainId} nativeToken={nativeToken.name} />
        </MainLayout>
    )
}

export default SendTransaction;