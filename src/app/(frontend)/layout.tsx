import React from 'react'
import './globals.css'
import { Metadata } from 'next'
import { Vazirmatn } from 'next/font/google'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['200', '400', '800'],
})

export const metadata: Metadata = {
  description: 'دموی سایت فروش ماشین توسط مهریار گلزامنش',
  title: 'Auto Demo',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.className} antialiased`}>
        <NavBar />
        <main className=" bg-[#0a0e14]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
