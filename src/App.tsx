import { useEffect, useState } from 'react'
import { useAccount, useBalance, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { useNavigate } from "react-router-dom";
import { useSwitchChain } from 'wagmi'
import MainLayout from './components/MainLayout';
import { Button } from './components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { Copy } from 'lucide-react';
import { getTokens , formatAddress, convertToEther} from './lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import TokenCard from './components/TokenCard';
import TokenList from './components/TokenList';

function App() {
  const navigate = useNavigate();

  const account = useAccount()
  const { disconnect } = useDisconnect()
  const { chains, switchChain } = useSwitchChain()

  const [tokens, setTokens] = useState<any>([])
  const [buttonText, setButtonText] = useState('')
  const [accountBalance, setAccountBalance] = useState<any>(0)

  const balance = useBalance({ address: account?.addresses?.[0], query: { refetchIntervalInBackground: true,
    refetchInterval: 1000 ,
    enabled: true, 
    notifyOnChangeProps:['data']
  } })
  
  
  useEffect(() => {
    if (account.isConnected) {
      fetchTokens()
    }
  }, [account?.chainId, account?.addresses?.[0]])

  useEffect(() => {
    console.log(account.status);
    if (account.status === 'disconnected') {
      navigate('/login')
    }
    setButtonText(formatAddress(account?.addresses?.[0] ?? ''))
  }, [account.status])
  
  const fetchTokens = async () => {
    const tokens = await getTokens(account?.chainId, account?.addresses?.[0])
    console.log(balance);
    
    setTokens(tokens)
  }
 

  useEffect(() => {
    const ethBalance = BigInt(balance.data?.value ?? 0).toString()
    setAccountBalance(convertToEther(ethBalance,balance.data?.decimals))
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



  return (
    <MainLayout>
      <div className='h-full w-full flex flex-col gap-4'>
        <h2>Account</h2>
        {accountBalance}
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
          {/* {account?.chain} */}
          chainId: {account.chainId}
        </div>
        <div>
          {chains && chains.map((chain) => (
            <button key={chain.id} onClick={() => switchChain({ chainId: chain.id })}>
              {chain.nativeCurrency.symbol}
            </button>
          ))}
        </div>

        {/* <div className="p-4">
                {
                  tokens && tokens.map((token:any) => (
                    <div key={token.address} className="flex">
                      <div>
                        <div>{token.name}</div>
                        <div>{token.symbol}</div>
                      </div>
                      <div>{token.balance}</div>
                    </div>
                  ))
                }
              </div> */}

        <Button onClick={() => navigate('/send')}>
          Send
        </Button>
        {
          account.isConnected && (
            <Select defaultValue={String(account?.chain?.id)} onValueChange={(value: any) => {
              console.log(value);

              switchChain({ chainId: value })
              console.log('triggered');
            }
            }>
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
            <TokenList/>
          </TabsContent>
          <TabsContent className='w-full px-2' value='transaction'>
            Transaction  
          </TabsContent>
        </Tabs>

      </div>


    </MainLayout>
  )
}

export default App
