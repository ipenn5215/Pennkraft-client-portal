import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pennkraft Estimating - Professional Construction & Tech Solutions',
  description: 'Expert estimating services for residential & commercial painting, tile, flooring, drywall, glass work, plus real estate photography and AI tech integration.',
  keywords: 'construction estimating, painting estimates, tile estimates, real estate photography, AI tech solutions, prevailing wage',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}