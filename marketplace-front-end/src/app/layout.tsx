// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import { CartProvider } from "@/context/CartContext"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your App Title',
  description: 'Your app description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* without this, Next can't inject Tailwind's <link> or any metadata */}
      <head />
      <body className={inter.className}>
        <CartProvider>
          <AuthProvider>
            {/* <Navbar /> */}
            {children}
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  )
}
