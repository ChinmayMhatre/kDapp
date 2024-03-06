import { FC, useEffect, useState } from 'react'
import MainLayout from './components/MainLayout';
import { Button } from "@/components/ui/button"
import { useBalance, useTransaction, useTransactionReceipt, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useAccount } from 'wagmi';
import { useSendTransaction } from 'wagmi'
import { isAddress, parseEther, parseGwei } from 'viem';

import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom';
import { convertToEther, getTokens } from './lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from './components/ui/select';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { retrieveTokens } from './lib/api';

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
    const [transactionHash, setTransactionHash] = useState('')
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
            setNativeToken({
                name: balance.data?.symbol,
                balance: ethBalance
            })
        }
    }, [balance.isSuccess])



    const { data: tokens, isLoading, isError, refetch } = useQuery({ queryKey: ['tokens', account], queryFn: retrieveTokens, enabled: false });

    useEffect(() => {
        refetch()
    }, [account?.chainId, account?.addresses?.[0]])

    const { sendTransaction } = useSendTransaction()



    const displayTokenBalance = () => {
        if (selectedToken === nativeToken.name) {
            return Number(nativeToken.balance).toFixed(4)
        }
        return Number(tokens?.find((el) => el.symbol === selectedToken)?.balance).toFixed(4)
    }


    const handleAmount = (e: any) => {
        setAmountError("")
        const currentToken = tokens?.find((el) => el.symbol === selectedToken)
        setAmount(e.target.value)

        if (selectedToken === "ETH") {
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
            toast('Sending Transaction' )
            sendTransaction({
                to: senderAddress,
                value: parseEther(amount),
                gas: BigInt(21000),
            }, {
                onSuccess: (data) => {
                    setTransactionHash(data)
                    const newTransaction = {
                        payload : {
                            to:senderAddress,
                            value: amount,
                            gas:BigInt(21000).toString()
                        },
                        hash:data
                    }
                    localStorage.setItem(`${account?.address}`, JSON.stringify(newTransaction))
                    navigate('/')
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
                args: [senderAddress, BigInt(Number(amount) * 10 ** tokenDetails?.decimals)],
                abi: [{ "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }],
                gas: BigInt(43500).toString(),
            }

            writeContract(payload, {
                onSuccess: (data) => {
                    const storePayload = {
                        chainId: account.chainId,
                        gas: BigInt(43500).toString(),
                        address: tokenDetails?.address,
                        functionName: 'transfer',
                        args: [senderAddress, BigInt(Number(amount) * 10 ** tokenDetails?.decimals).toString()],
                        abi: [{ "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]
                    }
                    const newTransaction = {
                        storePayload,
                        hash: data
                    }
                    localStorage.setItem(`${account?.address}`, JSON.stringify(newTransaction))
                    navigate('/')
                },
                onError: (error) => {
                    console.log(error);
                    
                    toast('Error sending transaction')
                }
            }
            )
        }

        // 0x7684e23fca3fd814bb05da68804b4d283734e1e9c66df9e321bcdd7816b76277

    }

    // const transaction = useTransaction({
    //     hash: transactionHash
    // })
    // console.log('transaction', transaction?.data);
    // const TransactionReceipt = useTransactionReceipt({
    //     hash: transactionHash
    // })
    // console.log('TransactionReceipt', TransactionReceipt?.data);
    // const waitTransaction = useWaitForTransactionReceipt({
    //     hash: transactionHash
    // })
    // console.log('wait Transaction', waitTransaction);


    if (account.isConnecting || isLoading) {
        return <div>Loading...</div>
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
                <Input placeholder="Enter the amount" value={amount} className=' border-0 p-0 text-lg text-center' type='number' onChange={(e) => handleAmount(e)} />
                <p className=' text-red-700 text-sm'>{amountError}</p>
                <Button className='w-full' onClick={() => handleSendTransaction()}>Send</Button>
                <div className="">
                    {error}
                </div>
            </div>
        </MainLayout>
    )
}

export default SendTransaction;