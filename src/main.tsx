
import 'typeface-inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.tsx'
import { config } from './wagmi.ts'

import './index.css'
import Login from './Login.tsx'
import SendTransaction from './SendTransaction.tsx'

globalThis.Buffer = Buffer

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/send",
    element: <SendTransaction />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
      </QueryClientProvider>
    </WagmiProvider>
)
