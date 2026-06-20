import Link from "next/link";
import Image from "next/image";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { getCurrencySymbol } from "@/lib/settings";

interface Product {
  id: string; nameAr: string; slug: string;
  price: number; salePrice: number; mainImage?: string | null;
  category: { nameAr: string };
}

export async function OffersSection({ products }: { products: Product[] }) {
  const currencySymbol = await getCurrencySymbol();

  return (
    <section style={{ background: "#261B6D", borderTop: "3px solid #1a1a1a", borderBottom: "3px solid #1a1a1a" }}
      className="py-10 md:py-14 relative overflow-hidden">

      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[
          { text: "セール", x: "4%",  y: "6%",  size: "6rem", rot: "-10deg", op: 0.05 },
          { text: "割引",   x: "78%", y: "58%", size: "8rem", rot: "15deg",  op: 0.04 },
          { text: "特別",   x: "58%", y: "4%",  size: "5rem", rot: "-5deg",  op: 0.05 },
        ].map((k, i) => (
          <div key={i} className="absolute font-black"
            style={{ left: k.x, top: k.y, fontSize: k.size, color: "#B2DE81", opacity: k.op, transform: `rotate(${k.rot})`, fontFamily: "serif" }}>
            {k.text}
          </div>
        ))}
      </div>

      <div className="container-custom relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase mb-3 font-en"
              style={{ background: "#B2DE81", color: "#261B6D", padding: "4px 12px", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a", borderRadius: "2px" }}>
              LIMITED TIME
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-2">عروض حصرية</h2>
            <p className="text-[#B2DE81]/70 text-sm mt-1">أسعار لا تتكرر — اغتنم الفرصة!</p>
          </div>
          <Link href="/products?sale=true" className="brut-link-btn-white">
            كل العروض ←
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const discount = calculateDiscountPercent(product.price, product.salePrice);
            return (
              <Link key={product.id} href={`/products/${product.slug}`} className="offer-card group block">
                <div className="relative aspect-square" style={{ background: "#FAFAF5", borderBottom: "2px solid #1a1a1a" }}>
                  {product.mainImage ? (
                    <Image src={product.mainImage} alt={product.nameAr} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">🍵</div>
                  )}
                  <div className="absolute top-3 right-3 text-white text-sm font-black px-2.5 py-1"
                    style={{ background: "#ff3b3b", border: "1.5px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a", borderRadius: "2px" }}>
                    -{discount}%
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-black text-[#261B6D]/50 mb-1 font-en uppercase tracking-wide">
                    {product.category.nameAr}
                  </p>
                  <h3 className="text-sm font-bold text-[#261B6D] line-clamp-1 mb-2">{product.nameAr}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-[#261B6D]">{formatPrice(product.salePrice, currencySymbol)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatPrice(product.price, currencySymbol)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
