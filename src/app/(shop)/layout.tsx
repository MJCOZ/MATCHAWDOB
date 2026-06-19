export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: "asc" },
    select: { nameAr: true, slug: true },
  });

  return (
    <>
      <Header categories={categories} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
