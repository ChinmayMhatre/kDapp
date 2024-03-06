import React, { FC } from 'react'
import { Toaster } from './ui/sonner'

interface MainLayoutProps {
  children : React.ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className='mx-auto relative max-w-sm px-2 h-screen pt-4'>
     {children}
     <Toaster position='bottom-center'  richColors={true} />
    </div>
  )
}

export default MainLayout;