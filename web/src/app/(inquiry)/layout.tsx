import { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata:Metadata = {
  title: "Inquiry"
}

const inter = Inter({ subsets: ['latin'], display: 'swap', adjustFontFallback: false })

export default function InquiryLayout({
                                        children,
                                      }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`flex flex-col p-8 gap-2 justify-center items-center ${inter.className}`}>
      {children}
    </div>
  )
}