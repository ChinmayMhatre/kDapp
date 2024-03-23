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
  const navigate = useNavigate();
  const account = useAccount()


  useEffect(() => {
    if (account.isConnected) {
      navigate('/')
    }
  }, [account.isConnected])


  const metamask: any = connectors.find((connector) => connector.id === 'io.metamask')
  const walletConnect: any = connectors.find((connector) => connector.id === "walletConnect")
  console.log(connectors, 'connectors');

  const handleConnect = async (id: any) => {
    if (metamask && metamask.uid === id) {
      connect({ connector: metamask }, {
        onSuccess: () => {
          navigate('/')
        },
        onError: (error) => {
          toast.error(error?.message, {
            classNames: { toast: 'bg-red-500 text-white' }
          })
        }
      })
    } else if (walletConnect && walletConnect.id === id) {
      connect({ connector: walletConnect }, {
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
  }

  return (
    <MainLayout>
      <img src={Icons} alt="login" className='w-full h-full bg-pattern absolute mx-auto' />
      <div className='flex justify-center items-center h-full flex-col gap-4'>
        <div className="flex flex-col z-10  justify-center items-center gap-2">
          <img src={Otter} alt="" />
        </div>
        <h2 className=' font-bold text-4xl z-10 text-primary'>Otter Wallet</h2>
        {
          metamask && (<Button
            key={metamask?.uid}
            onClick={() => handleConnect(metamask.uid)}
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
                  {<img src={metamask?.icon} className='mr-2 z-10' alt="metamask" width={20} height={20} />}
                  Connect with {metamask?.name}
                </>
              )
            }
          </Button>)
        }
        {
          walletConnect && (<Button
            key={walletConnect?.id}
            onClick={() => handleConnect(walletConnect.id)}
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
                  Connect with {walletConnect?.name}
                </>
              )
            }
          </Button>)
        }
      </div>
    </MainLayout>
  )
}

export default Login;