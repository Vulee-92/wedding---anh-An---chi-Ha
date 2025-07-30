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
  title: "Thiệp Cưới John Ân - Cát Hạ",
  description: "Nếu Đức Chúa Trời yêu thương chúng ta như thế, chúng cũng phải yêu thương nhau. - 1 Giăng 4:11",
  generator: 'https://pixel-duo.vercel.app/',
  openGraph: {
    title: "Thiệp Cưới John Ân - Cát Hạ",
    description: "Nếu Đức Chúa Trời yêu thương chúng ta như thế, chúng cũng phải yêu thương nhau. - 1 Giăng 4:11",
    url: "https://an-ha.vercel.app/", // Thay bằng domain thật
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753777468/IMG_5421_11zon_1_lkexey.jpg",
        width: 1200,
        height: 630,
        alt: "Thiệp Cưới John Ân - Cát Hạ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiệp Cưới John Ân - Cát Hạ",
    description: "Nếu Đức Chúa Trời yêu thương chúng ta như thế, chúng cũng phải yêu thương nhau. - 1 Giăng 4:11",
    images: [
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753777468/IMG_5421_11zon_1_lkexey.jpg",
    ],
  },
};

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
