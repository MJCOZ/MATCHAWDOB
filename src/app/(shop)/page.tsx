import { prisma } from "@/lib/prisma";
import { HeroBanner } from "@/components/shop/HeroBanner";
import { CategoriesSection } from "@/components/shop/CategoriesSection";
import { FeaturedProducts } from "@/components/shop/FeaturedProducts";
import { OffersSection } from "@/components/shop/OffersSection";
import { NewProducts } from "@/components/shop/NewProducts";
import { FeaturesBar } from "@/components/shop/FeaturesBar";

export default async function HomePage() {
  // جلب البيانات بشكل متوازٍ لتسريع الصفحة
  const [categories, featuredProducts, newProducts, saleProducts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
      take: 8,
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    }),

    prisma.product.findMany({
      where: { isActive: true, isFeatured: true, stock: { gt: 0 } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { category: { select: { nameAr: true, slug: true } } },
    }),

    prisma.product.findMany({
      where: { isActive: true, isNew: true, stock: { gt: 0 } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { category: { select: { nameAr: true, slug: true } } },
    }),

    prisma.product.findMany({
      where: { isActive: true, salePrice: { not: null }, stock: { gt: 0 } },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { category: { select: { nameAr: true, slug: true } } },
    }),
  ]);

  // تحويل Decimal إلى number
  const serialize = (products: any[]) =>
    products.map((p) => ({
      ...p,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      images: Array.isArray(p.images) ? p.images : JSON.parse(p.images as string || "[]"),
    }));

  return (
    <div className="animate-fadeInUp">
      {/* شريط المميزات */}
      <FeaturesBar />

      {/* البانر الرئيسي */}
      <HeroBanner />

      {/* التصنيفات */}
      <CategoriesSection categories={categories as any} />

      {/* المنتجات المميزة */}
      {featuredProducts.length > 0 && (
        <FeaturedProducts products={serialize(featuredProducts)} />
      )}

      {/* قسم العروض */}
      {saleProducts.length > 0 && (
        <OffersSection products={serialize(saleProducts)} />
      )}

      {/* المنتجات الجديدة */}
      {newProducts.length > 0 && (
        <NewProducts products={serialize(newProducts)} />
      )}
    </div>
  );
}
