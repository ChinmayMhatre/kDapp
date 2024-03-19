import { FC } from 'react'
import { AlertDialog,AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useSwitchChain } from 'wagmi';

interface SwitchChainModalProps {
  open: boolean
}

const SwitchChainModal: FC<SwitchChainModalProps> = ({ open }) => {

  const { chains, switchChain } = useSwitchChain()

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hi,Please switch to one of the supported chains</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
        <div className=" bg-slate-100 inline-flex items-center gap-2 p-2 w-full justify-around rounded-full">
            {chains && chains.map((chain) => (
              <button key={chain.id} onClick={() => switchChain({ chainId: chain.id })} className={` bg-white  shadow-md  font-semibold w-full  rounded-full  px-4 py-2 text-sm`}>
                {chain.nativeCurrency.name}
              </button>
            ))}
          </div>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SwitchChainModal;