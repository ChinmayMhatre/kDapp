import { useEffect, useState } from 'react'
import { useAccount, useBalance, useConnect, useDisconnect, useEnsName, useTransaction } from 'wagmi'
import { useNavigate } from "react-router-dom";
import { useSwitchChain } from 'wagmi'
import MainLayout from './components/MainLayout';
import { Button } from './components/ui/button';
import Otter from './assets/otter.svg';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { Copy } from 'lucide-react';
import { getTokens, formatAddress, convertToEther } from './lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import TokenList from './components/TokenList';
import MyTransactions from './components/MyTransactions';
import PendingTransaction from './components/PendingTransaction';

function App() {
  const navigate = useNavigate();

  const account = useAccount()
  const { disconnect } = useDisconnect()
  const { chains, switchChain } = useSwitchChain()
  const [buttonText, setButtonText] = useState('')
  const [accountBalance, setAccountBalance] = useState<any>(0)
  const [pendingTransaction, setPendingTransaction] = useState<pendingTransactionType>({
    payload: null,
    hash: ''
  })




  type pendingTransactionType = {
    payload: any,
    hash: string
  }

  const balance = useBalance({
    address: account?.addresses?.[0], query: {
      refetchIntervalInBackground: true,
      enabled: true,
      notifyOnChangeProps: ['data']
    }
  })

  useEffect(() => {
    localStorage.getItem(`${account?.address}`) && setPendingTransaction(JSON.parse(localStorage.getItem(`${account?.address}`) as string))
  },[])


  useEffect(() => {
    if (account.status === 'disconnected') {
      navigate('/login')
    }
    setButtonText(formatAddress(account?.addresses?.[0] ?? ''))
  }, [account.status])


  useEffect(() => {
    const ethBalance = BigInt(balance.data?.value ?? 0).toString()
    setAccountBalance(convertToEther(ethBalance, balance?.data?.decimals))
  }, [balance])


  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setButtonText('Copied');
      setTimeout(() => setButtonText(formatAddress(account?.addresses?.[0] ?? '')), 1000);
    } catch (err) {
      console.error('Error in copying text: ', err);
    }
  }

  console.log(pendingTransaction,'pending');
  

  return (
    <MainLayout>
      <div className='h-full w-full flex flex-col gap-4'>
        <img src={Otter} alt="logo" className='h-14 w-14' />
        <h2 className=' font-bold text-4xl text-slate-700'>
        {Number(accountBalance).toPrecision(4)} <span className=' text-xl text-slate-500'>{balance?.data?.symbol}</span>
        </h2>
        <div className=" gap-3 flex">
          <Button onClick={() => copyToClipboard(account?.addresses?.[0] ?? '')}>
            {buttonText}
            <Copy className="ml-2 h-4 w-4" />
          </Button>
          {account.status === 'connected' && (
            <Button onClick={() => disconnect()}>
              Disconnect
            </Button>
          )}
        </div>
        <div>
          <br />
          chainId: {account.chainId}
        </div>
        <div>
          {chains && chains.map((chain) => (
            <button key={chain.id} onClick={() => switchChain({ chainId: chain.id })}>
              {chain.nativeCurrency.symbol}
            </button>
          ))}
        </div>

        <Button onClick={() => navigate('/send')}>
          Send
        </Button>
        {
          account.isConnected && (
            <Select defaultValue={String(account?.chain?.id)} onValueChange={(value: any) => { switchChain({ chainId: value })?.onError((e) => console.log(e)) }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {
                  chains && chains.map((chain) => (
                    <SelectItem value={String(chain.id)}>{chain?.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          )
        }
        <Tabs defaultValue='token' className='w-full' >
          <TabsList className='w-full'>
            <TabsTrigger className='w-full' value='token' >Tokens</TabsTrigger>
            <TabsTrigger className='w-full' value='transaction' >Transactions</TabsTrigger>
          </TabsList>
          <TabsContent className='w-full px-2' value='token'>
            <TokenList />
          </TabsContent>
          <TabsContent className='w-full px-2' value='transaction'>
            <MyTransactions address={account.address} chainId={account.chainId} token={balance?.data?.symbol} />
          </TabsContent>
        </Tabs>

        {
           pendingTransaction?.hash.length > 0 && (
            <PendingTransaction userAddress={account.address as string} chainId={account?.chainId} nativeToken={balance?.data?.symbol ?? ''} hash={pendingTransaction?.hash} payload = {pendingTransaction?.payload} />
          )
        }

      </div>


    </MainLayout>
  )
}

export default App
