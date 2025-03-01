import { auth } from "@/auth"
import { SiteHeader } from "@/components/site-header"
import AuthProvider from "@/provider/auth-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Manage your profile and settings",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <SiteHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

