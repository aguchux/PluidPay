import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import StoreProvider from 'context/store-provider';
import { ThemeProvider } from 'context/theme-context';
import { ThemeSwitcher } from '@components/theme-switcher';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PluidPay: The Ultimate Payment Solution',
  description:
    'This widget will allow a user to see the costs associated with sending a specific amount of money from one country to another, comparing different service providers.',
  applicationName: 'PluidPay',
  keywords: ['PluidPay', 'payment solution', 'money transfer', 'currency exchange'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icons/android-icon-36x36.png', sizes: '36x36', type: 'image/png' },
      { url: '/icons/android-icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/android-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/android-icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/android-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/icons/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/icons/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/icons/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/icons/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/icons/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/icons/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [{ rel: 'mask-icon', url: '/icons/favicon.ico', color: '#e50025' }],
  },
  manifest: '/icons/manifest.json',
  category: 'Finance and Payments',
  classification: 'Business Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* I decided to include additional meta tags for better SEO */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pluid Pay" />
        <meta name="theme-color" content="#e50025" />
        <meta name="msapplication-TileColor" content="#e50025" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
            {children}
            <ThemeSwitcher />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
