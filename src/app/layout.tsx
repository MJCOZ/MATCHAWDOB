import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: {
    default: "MatchaWdob - ماتشا من الفضاء",
    template: "%s | MatchaWdob",
  },
  description: "متجر MatchaWdob — ماتشا من الفضاء. عالم الماتشا الياباني والشخصيات الكيوت. تسوق أفضل منتجات الماتشا مع شحن سريع لجميع مناطق المملكة",
  keywords: ["ماتشا", "MatchaWdob", "متجر ياباني", "شاي ماتشا", "تسوق سعودي"],
  authors: [{ name: "MatchaWdob" }],
  openGraph: { type: "website", locale: "ar_SA", siteName: "MatchaWdob" },
};

async function getTheme() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "customizer_data" } });
    if (!setting) return { primary: "#261B6D", secondary: "#B2DE81", bg: "#F8F7FF" };
    const data = JSON.parse(setting.value);
    return {
      primary:   data.primaryColor   || "#261B6D",
      secondary: data.secondaryColor || "#B2DE81",
      bg:        data.bgColor        || "#F8F7FF",
    };
  } catch {
    return { primary: "#261B6D", secondary: "#B2DE81", bg: "#F8F7FF" };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getTheme();

  const themeCSS = `
    :root {
      --theme-primary:   ${theme.primary};
      --theme-secondary: ${theme.secondary};
      --theme-bg:        ${theme.bg};
    }
    body { background-color: ${theme.bg} !important; }
    .btn-primary { background-color: ${theme.primary} !important; }
    .btn-primary:hover { background-color: ${theme.primary}dd !important; }
    .btn-secondary { background-color: ${theme.secondary} !important; color: ${theme.primary} !important; }
    .admin-sidebar { background: linear-gradient(160deg, ${theme.primary} 0%, ${theme.primary}cc 100%) !important; }
  `;

  return (
    <html lang="ar" dir="rtl">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body className="text-gray-900 antialiased" style={{ fontFamily: "'AraHamahHoms', sans-serif", backgroundColor: theme.bg }}>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "'AraHamahHoms', sans-serif",
                direction: "rtl",
                background: theme.primary,
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
