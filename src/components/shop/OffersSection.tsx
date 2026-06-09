import Link from "next/link";
import Image from "next/image";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { WavyDivider } from "@/components/brand/WavyDivider";

interface Product {
  id: string;
  nameAr: string;
  slug: string;
  price: number;
  salePrice: number;
  mainImage?: string | null;
  category: { nameAr: string };
}

export function OffersSection({ products }: { products: Product[] }) {
  return (
    <>
      <WavyDivider color="#261B6D" height={50} />
      <section className="bg-[#261B6D] py-14">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[#B2DE81] font-bold text-sm mb-1 flex items-center gap-1">
                <span>✦</span> لوقت محدود
              </p>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-black text-white">عروض حصرية</h2>
                <span className="bg-[#B2DE81] text-[#261B6D] text-xs font-black px-3 py-1 rounded-full">خصومات ضخمة</span>
              </div>
              <p className="text-[#B2DE81]/70 text-sm mt-1">أسعار لا تتكرر - اغتنم الفرصة!</p>
            </div>
            <Link href="/products?sale=true" className="bg-[#B2DE81] text-[#261B6D] hover:bg-[#8fc455] font-black text-sm px-5 py-2.5 rounded-2xl transition-colors">
              كل العروض ←
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const discount = calculateDiscountPercent(product.price, product.salePrice);
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-[#B2DE81]/20 transition-all border-2 border-transparent hover:border-[#B2DE81]/30"
                >
                  <div className="relative aspect-square bg-[#eeedf8]">
                    {product.mainImage ? (
                      <Image src={product.mainImage} alt={product.nameAr} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">🍵</div>
                    )}
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-black px-2.5 py-1 rounded-full shadow-md">
                      -{discount}%
                    </div>
                    <div className="absolute top-3 left-3 text-lg">✦</div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[#261B6D]/60 font-medium mb-1">{product.category.nameAr}</p>
                    <h3 className="text-sm font-bold text-[#261B6D] line-clamp-1 mb-2">{product.nameAr}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-[#261B6D]">{formatPrice(product.salePrice)}</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <WavyDivider color="#261B6D" flip={true} height={50} />
    </>
  );
}
