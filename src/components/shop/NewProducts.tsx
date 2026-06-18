import Link from "next/link";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string; nameAr: string; slug: string;
  price: number; salePrice?: number | null; mainImage?: string | null;
  stock: number; isFeatured: boolean; isNew: boolean;
  rating?: number; reviewCount?: number;
  category: { nameAr: string; slug: string };
}

export function NewProducts({ products }: { products: Product[] }) {
  return (
    <section className="container-custom py-14">

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="section-tag mb-3 inline-flex">
            <span className="font-en">✦ NEW ARRIVAL</span>
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#261B6D] mt-2">وصل حديثاً</h2>
          <p className="text-gray-500 text-sm mt-1">أحدث ما وصلنا من عالم الماتشا الياباني</p>
        </div>
        <Link href="/products?new=true" className="brut-link-btn">
          عرض الكل ←
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} categoryName={product.category.nameAr} />
        ))}
      </div>
    </section>
  );
}
