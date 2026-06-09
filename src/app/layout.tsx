import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "متجر الخير - تسوق بثقة",
    template: "%s | متجر الخير",
  },
  description: "متجر إلكتروني سعودي احترافي - أفضل المنتجات بأسعار منافسة مع توصيل سريع",
  keywords: ["متجر إلكتروني", "تسوق أونلاين", "السعودية", "تسوق سعودي"],
  authors: [{ name: "متجر الخير" }],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "متجر الخير",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`${cairo.className} bg-gray-50 text-gray-900 antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "var(--font-cairo)",
                direction: "rtl",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
