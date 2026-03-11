import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '100xMoney - AI-Powered Stock Research',
  description:
    'Make smarter investment decisions with AI-powered valuation, earnings analysis, and portfolio tools.',
  keywords: ['stock research', 'AI investing', 'valuation', 'earnings analysis', 'portfolio'],
  openGraph: {
    title: '100xMoney - AI-Powered Stock Research',
    description: 'Make smarter investment decisions with AI-powered tools.',
    url: 'https://100xmoney.com',
    siteName: '100xMoney',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
