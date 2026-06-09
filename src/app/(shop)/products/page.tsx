import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductSortSelect } from "@/components/shop/ProductSortSelect";
import type { Metadata } from "next";

interface SearchParams {
  category?: string;
  q?: string;
  sale?: string;
  new?: string;
  featured?: string;
  sort?: string;
  page?: string;
  minPrice?: string;
  maxPrice?: string;
}

export const metadata: Metadata = {
  title: "جميع المنتجات",
  description: "تسوق من أفضل المنتجات بأسعار تنافسية",
};

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: any = { isActive: true };

  if (searchParams.category) {
    const cat = await prisma.category.findUnique({ where: { slug: searchParams.category } });
    if (cat) where.categoryId = cat.id;
  }

  if (searchParams.q) {
    where.OR = [
      { nameAr: { contains: searchParams.q, mode: "insensitive" } },
      { descriptionAr: { contains: searchParams.q, mode: "insensitive" } },
      { tags: { has: searchParams.q } },
    ];
  }

  if (searchParams.sale === "true") where.salePrice = { not: null };
  if (searchParams.new === "true") where.isNew = true;
  if (searchParams.featured === "true") where.isFeatured = true;
  if (searchParams.minPrice) where.price = { ...(where.price || {}), gte: parseFloat(searchParams.minPrice) };
  if (searchParams.maxPrice) where.price = { ...(where.price || {}), lte: parseFloat(searchParams.maxPrice) };

  const orderBy: any =
    searchParams.sort === "price_asc" ? { price: "asc" }
    : searchParams.sort === "price_desc" ? { price: "desc" }
    : searchParams.sort === "newest" ? { createdAt: "desc" }
    : { isFeatured: "desc" };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: { select: { nameAr: true, slug: true } } },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    images: Array.isArray(p.images) ? p.images : [],
  }));

  const totalPages = Math.ceil(total / limit);

  const pageTitle =
    searchParams.sale === "true" ? "العروض والخصومات 🔥"
    : searchParams.new === "true" ? "وصل حديثاً ✨"
    : searchParams.q ? `نتائج: "${searchParams.q}"`
    : "جميع المنتجات";

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* الفلاتر - الجانب */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductFilters categories={categories as any} currentParams={searchParams as any} />
        </aside>

        {/* المنتجات */}
        <div className="flex-1">
          {/* رأس الصفحة */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-black text-gray-900">{pageTitle}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{total} منتج</p>
            </div>

            {/* الترتيب */}
            <ProductSortSelect currentSort={searchParams.sort} currentParams={searchParams as Record<string, string>} />
          </div>

          {/* شبكة المنتجات */}
          {serializedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {serializedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  categoryName={product.category.nameAr}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-6xl mb-4">🔍</p>
              <p className="text-xl font-bold text-gray-900 mb-2">لا توجد منتجات</p>
              <p className="text-gray-500 text-sm">جرب البحث بكلمات أخرى أو غير الفلاتر</p>
            </div>
          )}

          {/* الصفحات */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?${new URLSearchParams({ ...searchParams, page: p.toString() })}`}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${
                    p === page
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-orange-300"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
