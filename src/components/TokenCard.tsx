import  { FC } from 'react'

interface TokenCardProps {
    token: any
}

const TokenCard: FC<TokenCardProps> = ({ token }) => {
    console.log(token);
    
    return (
        <div className='flex justify-between py-2  items-center'>
            <div className="flex gap-2 justify-start items-center">
                {
                    token.logo ? (
                        <img src={token.logo} className='w-12 h-12' alt="" />
                    ) : (
                        <div className=" w-12 h-12 bg-slate-400 rounded-full"></div>
                    )
                }
                <div className="flex flex-col items-start justify-center">
                    <p className=' font-bold text-lg text-[#4E5C6B]'>{token.balance}</p>
                    <p className=' text-secondary-purple text-xs font-bold' >{token.symbol}</p>
                </div>
            </div>
        </div>
    )
}

export default TokenCard;