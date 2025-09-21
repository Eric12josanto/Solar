import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Gideon_Roman as Times_New_Roman } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const timesNewRoman = Times_New_Roman({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-times",
})

export const metadata: Metadata = {
  title: "Solar Breakeven Report Generator",
  description: "Professional solar breakeven analysis reports for installers",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${timesNewRoman.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
