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

/* كانجي لكل تصنيف */
const categoryKanji: Record<string, string> = {
  "matcha-powder": "抹茶",
  "matcha-tools":  "道具",
  drinks:          "飲み物",
  accessories:     "装飾",
  gifts:           "贈り物",
  default:         "茶",
};

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="container-custom py-14">

      {/* العنوان */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="section-tag mb-3 inline-flex">
            <span>✦</span> CATEGORIES
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#261B6D] mt-2">تسوق حسب التصنيف</h2>
          <p className="text-gray-500 text-sm mt-1">عالم الماتشا بكل نكهاته وأشكاله</p>
        </div>
        <Link href="/products"
          className="text-[#261B6D] text-sm font-black px-5 py-2.5 transition-all"
          style={{ border: "2px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a", borderRadius: "4px" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "5px 5px 0 #1a1a1a"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0 #1a1a1a"; }}
        >
          عرض الكل ←
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/products?category=${cat.slug}`}
            className="group relative flex flex-col items-center gap-2 p-4 bg-white text-center overflow-hidden transition-all"
            style={{ border: "2px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a", borderRadius: "4px" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 #261B6D"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 #1a1a1a"; }}
          >
            {/* كانجي الزخرفي */}
            <span className="absolute -bottom-1 -left-1 text-3xl font-black opacity-[0.06] text-[#261B6D] pointer-events-none select-none" style={{ fontFamily: "serif" }}>
              {categoryKanji[cat.slug] || categoryKanji.default}
            </span>

            {/* الأيقونة */}
            <div className="w-12 h-12 flex items-center justify-center text-2xl"
              style={{ background: "#FAFAF5", border: "2px solid #1a1a1a", borderRadius: "4px" }}>
              {cat.image ? (
                <Image src={cat.image} alt={cat.nameAr} width={32} height={32} className="object-contain" />
              ) : (
                categoryIcons[cat.slug] || categoryIcons.default
              )}
            </div>

            <div className="relative">
              <p className="text-xs font-black text-gray-900 group-hover:text-[#261B6D] transition-colors leading-snug">
                {cat.nameAr}
              </p>
              {cat._count && (
                <p className="text-xs text-gray-400 mt-0.5">{cat._count.products} منتج</p>
              )}
            </div>
          </Link>
        ))}

        {/* كل المنتجات */}
        <Link href="/products"
          className="group flex flex-col items-center gap-2 p-4 text-center transition-all"
          style={{ background: "#261B6D", border: "2px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a", borderRadius: "4px" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 #B2DE81"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 #1a1a1a"; }}
        >
          <div className="w-12 h-12 flex items-center justify-center text-2xl"
            style={{ background: "rgba(178,222,129,0.2)", border: "2px solid rgba(178,222,129,0.4)", borderRadius: "4px" }}>
            🌟
          </div>
          <div>
            <p className="text-xs font-black text-[#B2DE81]">كل المنتجات</p>
            <p className="text-xs text-[#B2DE81]/60 mt-0.5">عرض الكل</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
