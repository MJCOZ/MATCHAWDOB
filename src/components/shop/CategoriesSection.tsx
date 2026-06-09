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
  "matcha-powder": "🍵",
  "matcha-tools": "🥢",
  drinks: "🧋",
  accessories: "✨",
  gifts: "🎁",
  default: "🌿",
};

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="container-custom py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#B2DE81] font-bold text-sm mb-1 flex items-center gap-1">
            <span>✦</span> اكتشف
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-[#261B6D]">تسوق حسب التصنيف</h2>
          <p className="text-gray-500 text-sm mt-1">عالم الماتشا بكل نكهاته وأشكاله</p>
        </div>
        <Link href="/products" className="text-[#261B6D] hover:text-[#352a8a] text-sm font-bold flex items-center gap-1 border-2 border-[#261B6D]/20 hover:border-[#261B6D] px-4 py-2 rounded-2xl transition-all">
          عرض الكل ←
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3 p-4 bg-white rounded-3xl border-2 border-[#e8e6f5] hover:border-[#B2DE81] hover:shadow-lg hover:shadow-[#B2DE81]/20 transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 bg-[#eeedf8] group-hover:bg-[#B2DE81]/20 rounded-2xl flex items-center justify-center text-3xl transition-colors">
              {cat.image ? (
                <Image src={cat.image} alt={cat.nameAr} width={40} height={40} className="object-contain" />
              ) : (
                categoryIcons[cat.slug] || categoryIcons.default
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 group-hover:text-[#261B6D] transition-colors leading-snug">
                {cat.nameAr}
              </p>
              {cat._count && (
                <p className="text-xs text-gray-400 mt-0.5">{cat._count.products} منتج</p>
              )}
            </div>
          </Link>
        ))}

        {/* بطاقة كل المنتجات */}
        <Link
          href="/products"
          className="group flex flex-col items-center gap-3 p-4 bg-[#261B6D] rounded-3xl border-2 border-[#261B6D] hover:bg-[#352a8a] transition-all duration-300 text-center"
        >
          <div className="w-14 h-14 bg-[#B2DE81]/20 rounded-2xl flex items-center justify-center text-3xl">
            🌟
          </div>
          <div>
            <p className="text-xs font-bold text-[#B2DE81] leading-snug">كل المنتجات</p>
            <p className="text-xs text-[#B2DE81]/60 mt-0.5">عرض الكل</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
