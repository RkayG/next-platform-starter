import React, { lazy, Suspense } from 'react';

// Eagerly loaded components
import ParentComponent from '@/components/parent-banner';
import Disclaimer from '@/components/disclaimer';
import BottomSubscribe from '@/components/bottom-subscribe';
import ScrollBackTop from '@/components/scroll-back-top';
import SEO from '@/components/SEO';

// Lazily loaded components
const FeaturedEvent = lazy(() => import('@/components/featured'));
const Airdrops = lazy(() => import('@/components/airdrop-card'));
const TokenFarming = lazy(() => import('@/components/token-farming-card'));
const Games = lazy(() => import('@/components/parent-games-card'));
const RewardForTask = lazy(() => import('@/components/reward-task-card'));
const CryptoNews = lazy(() => import('@/components/crypto-news-card'));
const AcademySection = lazy(() => import('@/components/academy-card'));

// Loading fallback component
const LoadingFallback = () => <div className="text-center py-4">Loading...</div>;

export default function Page() {
    return (
        <>
        <SEO 
                title="Web3Fruity - Your Web3 Resource"
                description="Discover the latest in Web3, Airdrops, Games, and more"
                keywords='web3, airdrops, blockchain games, crypto, cryptocurrency, crypto rewards, 
                crypto education, free crypto, staking, crypto farming, telegram airdrops'
                logoUrl="/images/web3fruity-preview2.png"
                siteUrl="https://www.web3fruity.com"
            />
      
        <section className="relative">
            <ParentComponent />
            <Suspense fallback={<LoadingFallback />}>
                <FeaturedEvent />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Airdrops />
            </Suspense>
            
            <Suspense fallback={<LoadingFallback />}>
                <TokenFarming />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
                <Games />
            </Suspense>
            
            <Suspense fallback={<LoadingFallback />}>
                <RewardForTask />
            </Suspense>
            {/* <Suspense fallback={<LoadingFallback />}>
                <CryptoNews />
            </Suspense> */}
             
            <Suspense fallback={<LoadingFallback />}>
                <AcademySection />
            </Suspense>
           
            <Disclaimer />
            <BottomSubscribe />
            <ScrollBackTop />
        </section>
        </>
    );
}