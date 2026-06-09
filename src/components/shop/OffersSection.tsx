import Link from "next/link";
import Image from "next/image";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";

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
    <section className="bg-gradient-to-l from-orange-600 to-red-600 py-14">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔥</span>
              <h2 className="text-2xl md:text-3xl font-black text-white">عروض خاصة</h2>
            </div>
            <p className="text-orange-100 text-sm">أسعار لا تتكرر - لوقت محدود فقط!</p>
          </div>
          <Link href="/products?sale=true" className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors">
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
                className="bg-white rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100">
                  {product.mainImage ? (
                    <Image src={product.mainImage} alt={product.nameAr} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl text-gray-300">📦</div>
                  )}
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-black px-2.5 py-1 rounded-full shadow-md">
                    -{discount}%
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-orange-500 font-medium mb-1">{product.category.nameAr}</p>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-2">{product.nameAr}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-red-600">{formatPrice(product.salePrice)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
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
