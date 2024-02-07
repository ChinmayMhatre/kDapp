import React, { FC, useState } from 'react'
import MainLayout from './components/MainLayout';
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useEstimateGas } from 'wagmi'
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

const formSchema = z.object({
    recipient: z.string(),
    amount: z.string(),
})

interface SendTransactionProps {

}


const SendTransaction: FC<SendTransactionProps> = ({ }) => {
    // const [openDialog, setOpenDialog] = useState(false)
    const account = useAccount()
    // const handleReject = () => {
    //     setOpenDialog(false)
    // }
    const gas = useEstimateGas()
    console.log(gas);




    // const TransactionDetails = () => (
    //     <AlertDialog open={openDialog}>
    //             <AlertDialogContent>
    //                 <AlertDialogHeader>Transaction Details</AlertDialogHeader>
    //                 <div className="flex flex-col justify-left gap-4 ">
    //                     <div className="flex justify-between items-center">
    //                         <div className="">Network</div>
    //                         <div className=" text-[#7596BD]">{account?.chain?.name}</div>
    //                     </div>
    //                     <div className="flex justify-between items-center">
    //                         <div className="">Network</div>
    //                         <div className=" text-[#7596BD]">Eth</div>
    //                     </div>
    //                     <div className="flex justify-between items-center">
    //                         <div className="">Network</div>
    //                         <div className=" text-[#7596BD]">Eth</div>
    //                     </div>
    //                     <div className="flex justify-between items-center">
    //                         <div className="">Network</div>
    //                         <div className=" text-[#7596BD]">Eth</div>
    //                     </div>
    //                 </div>
    //                 <AlertDialogFooter>
    //                     <AlertDialogCancel onClick={handleReject}>Cancel</AlertDialogCancel>
    //                     <AlertDialogAction onClick={handleSendTransaction}>Send</AlertDialogAction>
    //                 </AlertDialogFooter>
    //             </AlertDialogContent>
    //         </AlertDialog>
    //     )
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recipient: "",
            amount: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    const { sendTransaction } = useSendTransaction()

    return (
        <MainLayout>
            {/* <TransactionDetails/> */}
            <Button onClick={() => sendTransaction({
                to: '0x058Da0C94b7D2EfDec67485c1A14bC80d8fdeac5',
                value: parseEther('0.000001'),
            })}>Send</Button>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="recipient"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sender's Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Add the address of the recipient
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Add amount field similarly */}
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input placeholder="0.0" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Add the amount you want to send
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </MainLayout>
    )
}

export default SendTransaction;