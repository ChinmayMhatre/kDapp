import { FC } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Button } from './ui/button';
import { useTransaction } from 'wagmi';
import {formatEther} from 'viem'

interface TransactionModalProps {
  
}

const TransactionModal: FC<TransactionModalProps> = ({  }) => {

    const transaction = useTransaction({
        hash:'0x7684e23fca3fd814bb05da68804b4d283734e1e9c66df9e321bcdd7816b76277'
      })

  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="outline">Show Dialog</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          <div className="flex flex-col gap-2 ">
            <div className="flex justify-between items-center">
                <p>
                    {transaction?.data?.from}
                </p>
            </div>
            <div className="flex justify-between items-center">
                <p>
                    {transaction?.data?.to}
                </p>
            </div>
            <div className="flex justify-between items-center">
                <p>
                    {transaction?.data?.value && formatEther(transaction?.data?.value)}
                </p>
            </div>
            <div className="flex justify-between items-center">
                <p>
                    {transaction?.data?.nonce}
                </p>
            </div>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default TransactionModal;