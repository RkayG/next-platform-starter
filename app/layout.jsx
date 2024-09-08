"use client";

import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { BottomNavigationPanel } from '../components/bottom-navigation';
import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CryptoPriceTicker from 'components/crypto-prices';

// Move this inside the RootLayout component
// const queryClient = new QueryClient();

// Remove this metadata export, as it's not used in client components
// export const metadata = {
//     title: {
//         template: '%s | Netlify',
//         default: 'Web3Fruity'
//     }
// };

export default function RootLayout({ children }) {
    // Create a new QueryClient instance for each request
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <html lang="en" data-theme="lofi">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <title>Web3Fruity</title>
            </head>
            <body className="antialiased bg-white">
                <QueryClientProvider client={queryClient}>
                    <div className="">
                        <div className="">
                            <Header />
                            <CryptoPriceTicker />
                            <div className="grow">{children}</div>
                            <Footer />
                            <BottomNavigationPanel />
                        </div>
                    </div>
                </QueryClientProvider>
            </body>
        </html>
    );
}