import type { Metadata } from "next";
import { Cairo, Fredoka } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

const fredoka = Fredoka({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: {
    default: "MatchaWdob - متجر الماتشا والدب",
    template: "%s | MatchaWdob",
  },
  description: "متجر MatchaWdob - عالم الماتشا الياباني والشخصيات الكيوت. تسوق أفضل منتجات الماتشا مع شحن سريع لجميع مناطق المملكة",
  keywords: ["ماتشا", "MatchaWdob", "متجر ياباني", "شاي ماتشا", "تسوق سعودي"],
  authors: [{ name: "MatchaWdob" }],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "MatchaWdob",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${fredoka.variable}`}>
      <body className={`${cairo.className} bg-[#F8F7FF] text-gray-900 antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "var(--font-cairo)",
                direction: "rtl",
                background: "#261B6D",
                color: "#fff",
                borderRadius: "16px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
