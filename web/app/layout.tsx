import '../styles/globals.css'
import React from 'react'
import { Vazirmatn } from 'next/font/google'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Providers } from './providers'

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-vazirmatn',
  display: 'swap'
})

export const metadata = {
  title: 'مؤسسه آزاد سینمایی طهرانی | Tehrani Free Cinema Institute',
  description: 'مؤسسه آزاد سینمایی طهرانی — وب‌سایت رسمی'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen bg-brand-cream font-sans text-brand-navy-dark">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
