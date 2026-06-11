export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";

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

const GF_URLS: Record<string, string> = {
  "Tajawal":              "https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap",
  "Cairo":                "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap",
  "Almarai":              "https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap",
  "Readex Pro":           "https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;600;700&display=swap",
  "IBM Plex Sans Arabic": "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;600;700&display=swap",
};

const THEME_DEFAULTS = { primary: "#261B6D", secondary: "#B2DE81", bg: "#FAFAF5", fontFamily: "AraHamahHoms", fontScale: "1" };

async function getTheme() {
  if (!process.env.DATABASE_URL) return THEME_DEFAULTS;
  try {
    const { prisma } = await import("@/lib/prisma");
    const setting = await prisma.setting.findUnique({ where: { key: "customizer_data" } });
    if (!setting) return { primary: "#261B6D", secondary: "#B2DE81", bg: "#F8F7FF", fontFamily: "AraHamahHoms", fontScale: "1" };
    const data = JSON.parse(setting.value);
    return {
      primary:    data.primaryColor   || "#261B6D",
      secondary:  data.secondaryColor || "#B2DE81",
      bg:         data.bgColor        || "#F8F7FF",
      fontFamily: data.fontFamily     || "AraHamahHoms",
      fontScale:  data.fontScale      || "1",
    };
  } catch {
    return THEME_DEFAULTS;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getTheme();

  const gfUrl = GF_URLS[theme.fontFamily];
  const fontStack = `'${theme.fontFamily}', sans-serif`;
  const basePx = Math.round(parseFloat(theme.fontScale) * 16);

  const themeCSS = `
    :root {
      --theme-primary:   ${theme.primary};
      --theme-secondary: ${theme.secondary};
      --theme-bg:        ${theme.bg};
    }
    html { font-size: ${basePx}px; }
    body { background-color: ${theme.bg} !important; font-family: ${fontStack} !important; }
    .font-en, h1:lang(en), h2:lang(en), h3:lang(en) { font-family: 'CleoFolk', 'Syne', sans-serif !important; }
    .btn-primary { background-color: ${theme.primary} !important; }
    .btn-primary:hover { background-color: ${theme.primary}dd !important; }
    .btn-secondary { background-color: ${theme.secondary} !important; color: ${theme.primary} !important; }
    .admin-sidebar { background: linear-gradient(160deg, ${theme.primary} 0%, ${theme.primary}cc 100%) !important; }
  `;

  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Syne — English brutalist fallback until CleoFolk font file is added */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap" />
        {gfUrl && <link rel="stylesheet" href={gfUrl} />}
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body className="text-gray-900 antialiased" style={{ fontFamily: fontStack, backgroundColor: theme.bg }}>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: fontStack,
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
