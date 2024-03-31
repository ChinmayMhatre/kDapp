import { FC } from 'react'
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
                    <p className=' font-bold text-lg text-[#4E5C6B]'>{token.symbol}</p>
                    <p className=' text-[#7596BD] text-xs font-bold' >{Number(token.balance).toFixed(4)} {token.symbol}</p>
                </div>
            </div>
        </div>
    )
}

export default TokenCard;