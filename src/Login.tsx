import { FC, useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi';
import MainLayout from './components/MainLayout';
import { Button } from './components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import Icons from './assets/loginIcons.svg';
import Otter from './assets/Otter.svg';
interface LoginProps {

}

const Login: FC<LoginProps> = ({ }) => {
  const { connectors, connect, status } = useConnect()

  const filteredConnectors = connectors.filter((connector) => connector.id === 'io.metamask' || connector.id === "walletConnect")

  const account = useAccount()
  const navigate = useNavigate();

  useEffect(() => {
    if (account.isConnected) {
      navigate('/')
    }
  }, [account.isConnected])


  const handleConnect = async (connector:any) => {
      connect({ connector: connector }, {
        onSuccess: () => {
          navigate('/')
        },
        onError: (error) => {
          toast.error(error?.message, {
            classNames: { toast: 'bg-red-500 text-white' }
          })
        }
      })
  }

  return (
    <MainLayout>
      <img src={Icons} alt="login" className='w-full h-full bg-pattern absolute mx-auto' />
      <div className='flex justify-center items-center h-full flex-col gap-4'>
        <div className="flex flex-col z-10  justify-center items-center gap-2">
          <img src={Otter} alt="Otter logo" />
        </div>
        <h2 className=' font-bold text-4xl z-10 text-primary'>Otter Wallet</h2>
        {
          filteredConnectors && filteredConnectors.map((connector: any) => (
            <Button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={status === 'pending'}
              className=' w-[70%] z-10 '
              type="button"
              variant={"outline"}
            >
              {
                status === "pending" ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 z-10 animate-spin' />
                    Connecting
                  </>
                ) : (
                  <>
                    {connector.id === "walletConnect" ?
                      <img src="./src/assets/walletConnect.svg" className='w-8' alt="wallet connect logo" />
                      : <img src={connector.icon} className='mr-2 z-10' alt={connector.name} width={20} height={20} />}
                    Connect with {connector.name}
                  </>
                )
              }
            </Button>
          ))
        }
      </div>
    </MainLayout>
  )
}

export default Login;