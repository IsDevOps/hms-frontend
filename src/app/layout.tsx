import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import dynamic from 'next/dynamic';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from './providers';
import { LayoutWrapper } from './layout-wrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const DynamicReduxProvider = dynamic(() => import('@/store/StoreProvider'));

const googleSans = localFont({
  src: [
    {
      path: '../fonts/ProductSans-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/ProductSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/ProductSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/ProductSans-Bold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/ProductSans-Black.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-google-sans',
  preload: true,
});

const arial = localFont({
  src: '../fonts/Arial.woff',
  variable: '--font-arial',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: '%s | hotel management',
    default: 'hotel management',
  },
  description: 'Your smart health companion',
  applicationName: 'hotel management Web',
  creator: 'Infostrategy Team',
  // metadataBase: new URL('https://base_url'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full scroll-pt-40 scroll-smooth">
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${googleSans.className} ${arial.variable} h-full min-h-dvh w-full`}
      >
        <DynamicReduxProvider>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster
              position="top-center"
              closeButton
              richColors
              theme="light"
            />
          </Providers>
        </DynamicReduxProvider>
      </body>
    </html>
  );
}
