import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  nameAr: string;
  slug: string;
  image?: string | null;
  _count?: { products: number };
}

const categoryIcons: Record<string, string> = {
  electronics: "📱",
  "mens-clothing": "👔",
  "womens-clothing": "👗",
  "home-kitchen": "🏠",
  "personal-care": "✨",
  sports: "⚽",
};

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="container-custom py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">تسوق حسب التصنيف</h2>
          <p className="text-gray-500 text-sm mt-1">اختر من مئات المنتجات في كل فئة</p>
        </div>
        <Link href="/products" className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1">
          عرض الكل ←
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-yellow-50 group-hover:from-orange-100 group-hover:to-yellow-100 rounded-2xl flex items-center justify-center text-3xl transition-colors">
              {cat.image ? (
                <Image src={cat.image} alt={cat.nameAr} width={40} height={40} className="object-contain" />
              ) : (
                categoryIcons[cat.slug] || "🛍️"
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 group-hover:text-orange-500 transition-colors leading-snug">
                {cat.nameAr}
              </p>
              {cat._count && (
                <p className="text-xs text-gray-400 mt-0.5">{cat._count.products} منتج</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
