import React, { FC, useEffect, useState } from 'react'
import MainLayout from './components/MainLayout';
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useBalance, useEstimateGas } from 'wagmi'
import { useAccount } from 'wagmi';
import { useSendTransaction } from 'wagmi'
import { parseEther } from 'viem';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



import { Input } from "@/components/ui/input"
import { useNavigate } from 'react-router-dom';
import { convertToEther, getTokens } from './lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from './components/ui/select';
const formSchema = z.object({
    recipient: z.string(),
    token: z.string(),
    amount: z.string(),
})

interface SendTransactionProps {

}


const SendTransaction: FC<SendTransactionProps> = ({ }) => {
    // const [openDialog, setOpenDialog] = useState(false)
    const [senderAddress, setSenderAddress] = useState<any>("")
    const [selectedToken, setSelectedToken] = useState<any>("ETH")
    const [nativeToken, setNativeToken] = useState<any>({
        name: "ETH",
        balance: "0.00"
    })
    const [amount, setAmount] = useState("")
    const [amountError, setAmountError] = useState("")
    const account = useAccount()
    const navigate = useNavigate()
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



    const retrieveTokens = async () => {
        const response = await axios.get(`https://deep-index.moralis.io/api/v2.2/${account?.addresses?.[0]}/erc20`, {
            params: {
                'chain': `0x${account?.chainId}`
            },
            headers: {
                'accept': 'application/json',
                'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY
            }
        });
        const temp = await getTokens(response.data)
        return temp
    }

    const { data: tokens, isLoading, isError, refetch } = useQuery({ queryKey: ['tokens'], queryFn: retrieveTokens, enabled: false });

    useEffect(() => {
        refetch()
    }, [account?.chainId, account?.addresses?.[0]])




    const { sendTransaction } = useSendTransaction()


    if (account.isConnecting) {
        return <div>Loading...</div>
    }

    const displayTokenBalance = () => {
        if(selectedToken === "ETH"){
            return Number(nativeToken.balance).toFixed(4)
        }
        return Number(tokens?.find((el)=>el.symbol===selectedToken)?.balance).toFixed(4)
    }


    const handleAmount = (e: any) => {
        setAmountError("")
        const currentToken = tokens?.find((el)=>el.symbol===selectedToken)
        setAmount(e.target.value)
        console.log(e.target.value, tokens)

        if(selectedToken === "ETH"){
            if (e.target.value > Number(nativeToken.balance)) {
                setAmountError("Amount exceeded")
            }
            return
        }
        
        if (e.target.value > Number(currentToken?.balance)) {
            setAmountError("Amount exceeded")
        }
    }

    return (
        <MainLayout>
            {/* <TransactionDetails/> */}
            {/* <Button onClick={() => sendTransaction({
                to: '0x058Da0C94b7D2EfDec67485c1A14bC80d8fdeac5',
                value: parseEther('0.000001'),
            })}>Send</Button> */}
                <div className=" border border-gray-400 rounded-lg p-2 flex flex-col justify-center items-center gap-1">
                    <p className='text-lg font-bold'>{account.chain?.name}</p>
                    <p className=' text-sm'> <span className=' text-gray-500 font-bold text-xs'>Balance: </span> {Number(nativeToken.balance).toFixed(4)} {nativeToken.name} </p>
                </div>
            <form >
                <Input placeholder="Enter the sender's address" value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} />
                <Select value={selectedToken} onValueChange={(value:any) => setSelectedToken(value)}>
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
                <Input placeholder="Enter the amount" value={amount} type='number' onChange={(e) => handleAmount(e)} />
                <p className=' text-red-700 text-sm'>{amountError}</p>
            </form>
        </MainLayout>
    )
}

export default SendTransaction;