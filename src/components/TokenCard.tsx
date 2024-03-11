import { FC } from 'react'
import Otter from '../assets/Otter.svg'
import OtterBnW from '../assets/OtterBnW.svg'

interface TokenCardProps {
    token: any
}

const TokenCard: FC<TokenCardProps> = ({ token }) => {

    return (
        <div className='flex justify-between py-2  items-center'>
            <div className="flex gap-2 justify-start items-center">
                <div className=" bg-slate-100 p-2 rounded-full">
                    <img src={OtterBnW} className='w-10 h-10 ' alt="otter" />
                </div>
                <div className="flex flex-col items-start justify-center">
                    <p className=' font-bold text-lg text-[#4E5C6B]'>{Number(token.balance).toFixed(4)}</p>
                    <p className=' text-secondary-purple text-xs font-bold' >{token.symbol}</p>
                </div>
            </div>
        </div>
    )
}

export default TokenCard;