import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Chatbot } from "@/components/chatbot"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Ubezpieczenia Wawer – Mateusz Pawelec | wawerpolisy.pl",
    template: "%s | wawerpolisy.pl",
  },
  description:
    "Agent ubezpieczeniowy w Wawrze (Warszawa). OC/AC, mieszkanie, życie, zdrowie, podróże i ubezpieczenia firmowe. Wycena i obsługa bez zbędnych formalności.",
  metadataBase: new URL("https://wawerpolisy.pl"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://wawerpolisy.pl",
    siteName: "wawerpolisy.pl",
    title: "Ubezpieczenia Wawer – Mateusz Pawelec",
    description:
      "Agent ubezpieczeniowy w Wawrze (Warszawa). OC/AC, mieszkanie, życie, zdrowie, podróże i ubezpieczenia firmowe.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body className={`${geist.className} ${geistMono.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Chatbot />
        <Analytics />
      </body>
    </html>
  )
}
