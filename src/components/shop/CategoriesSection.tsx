import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string; nameAr: string; slug: string;
  image?: string | null;
  _count?: { products: number };
}

const categoryIcons: Record<string, string> = {
  "matcha-powder": "🍵",
  "matcha-tools":  "🥢",
  drinks:          "🧋",
  accessories:     "✨",
  gifts:           "🎁",
  default:         "🌿",
};

const categoryKanji: Record<string, string> = {
  "matcha-powder": "抹茶",
  "matcha-tools":  "道具",
  drinks:          "飲",
  accessories:     "装",
  gifts:           "贈",
  default:         "茶",
};

const categoryColors: Record<string, string> = {
  "matcha-powder": "#d4f0a8",
  "matcha-tools":  "#c8e8ff",
  drinks:          "#ffd6e7",
  accessories:     "#ffe4b5",
  gifts:           "#e8d5ff",
  default:         "#f0f0f0",
};

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="container-custom py-14">

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="section-tag mb-3 inline-flex">
            <span className="font-en">✦ CATEGORIES</span>
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#261B6D] mt-2">تسوق حسب التصنيف</h2>
          <p className="text-gray-500 text-sm mt-1">عالم الماتشا بكل نكهاته وأشكاله</p>
        </div>
        <Link href="/products" className="brut-link-btn">
          كل المنتجات ←
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {categories.map((cat) => {
          const bg = categoryColors[cat.slug] || categoryColors.default;
          const kanji = categoryKanji[cat.slug] || categoryKanji.default;
          const icon = categoryIcons[cat.slug] || categoryIcons.default;
          return (
            <Link key={cat.id} href={`/products?category=${cat.slug}`}
              className="cat-card group relative flex flex-col items-center gap-3 p-5 text-center overflow-hidden">

              {/* كانجي زخرفي خلفي */}
              <span className="absolute -bottom-2 -left-1 text-4xl font-black opacity-[0.06] text-[#261B6D] pointer-events-none select-none"
                style={{ fontFamily: "serif" }}>
                {kanji}
              </span>

              {/* دائرة الأيقونة */}
              <div className="w-14 h-14 flex items-center justify-center text-2xl relative z-10 transition-transform duration-300 group-hover:scale-110"
                style={{ background: bg, border: "2px solid #1a1a1a", borderRadius: "4px" }}>
                {cat.image ? (
                  <Image src={cat.image} alt={cat.nameAr} width={36} height={36} className="object-contain" />
                ) : (
                  icon
                )}
              </div>

              <div className="relative z-10">
                <p className="text-sm font-black text-gray-900 group-hover:text-[#261B6D] transition-colors leading-snug">
                  {cat.nameAr}
                </p>
                {cat._count && (
                  <p className="text-xs text-gray-400 mt-0.5 font-en">{cat._count.products} منتج</p>
                )}
              </div>
            </Link>
          );
        })}

        {/* كارت "كل المنتجات" */}
        <Link href="/products" className="cat-card-navy group flex flex-col items-center gap-3 p-5 text-center">
          <div className="w-14 h-14 flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: "rgba(178,222,129,0.15)", border: "2px solid rgba(178,222,129,0.4)", borderRadius: "4px" }}>
            🌟
          </div>
          <div>
            <p className="text-sm font-black text-[#B2DE81]">كل المنتجات</p>
            <p className="text-xs text-[#B2DE81]/60 mt-0.5">عرض الكل ←</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
