import type React from "react"
import type { Metadata } from "next"
import { Ballet, Ephesis, Great_Vibes, Inter, Manrope, Oooh_Baby, Playfair_Display } from "next/font/google"
import "./globals.css"

// Font setups
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-playfair" })
const ephesis = Ephesis({ subsets: ["latin"], weight: "400", variable: "--font-ephesis" })
const ballet = Ballet({ subsets: ["latin"], weight: "400", variable: "--font-ballet",display: "swap" }) 

 const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})
const ooohbaby = Oooh_Baby({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ooohbaby", // Tùy chọn, dùng nếu bạn muốn gán biến CSS
  display: "swap",
})
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-greatvibes",
  display: "swap",
})
export const metadata: Metadata = {
  title: "Thiệp Cưới Anh Huy - Cẩm Vang",
  description: "Thiệp cưới điện tử của Trần Anh Huy và Mai Thị Cẩm Vang",
    generator: 'https://pixel-duo.vercel.app/'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${greatVibes.variable} ${playfair.variable} ${ephesis.variable} ${ballet.variable} ${ooohbaby.variable} ${manrope.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
