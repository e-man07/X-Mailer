import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'X-Mailer',
  description: 'Send encrypted emails directly from Twitter',
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="solads-site-verification" content="solads_verify_1755640973371_d61b3012c7dad6a1e0203da965374c97" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}