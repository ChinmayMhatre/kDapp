import React, { FC, useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi';
import MainLayout from './components/MainLayout';
import { Button } from './components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface LoginProps {

}

const Login: FC<LoginProps> = ({ }) => {
  const { connectors, connect, status } = useConnect()
  const navigate = useNavigate();
  const account = useAccount()


  useEffect(() => {
    if(account.isConnected){
      navigate('/')
    }
  }, [account.isConnected])
  

  const metamask: any = connectors.find((connector) => connector.id === 'io.metamask')



  const handleConnect = async () => {
    connect({ connector: metamask },{
      onSuccess: () => {
        navigate('/')
      },
      onError: (error) => {
        toast.error(error?.message, {
          classNames: { toast: 'bg-red-500 text-white'}
        })                                                                                                              
      }
    })
  }

  return (
    <MainLayout>
      <div className='flex justify-center items-center h-full flex-col gap-4'>
        <h2>Connect</h2>
        <Button
          key={metamask?.uid}
          onClick={handleConnect}
          disabled={status === 'pending'}
          className=' w-[70%] '
          type="button"
          variant={"outline"}
        >
          {
            status === "pending" ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                Connecting
              </>
            ) : (
              <>
                <img src={metamask.icon} className='mr-2' alt="metamask" width={20} height={20} />
                Connect with {metamask?.name}
              </>
            )
          }
        </Button>
      </div>
    </MainLayout>
  )
}

export default Login;