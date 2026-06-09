import Link from "next/link";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  nameAr: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  mainImage?: string | null;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  category: { nameAr: string; slug: string };
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="container-custom py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#B2DE81] font-bold text-sm mb-1 flex items-center gap-1">
            <span>✦</span> مختار بعناية
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-[#261B6D]">منتجات مميزة</h2>
          <p className="text-gray-500 text-sm mt-1">أفضل ما لدينا من ماتشا وإكسسوارات</p>
        </div>
        <Link href="/products?featured=true" className="text-[#261B6D] hover:text-[#352a8a] text-sm font-bold flex items-center gap-1 border-2 border-[#261B6D]/20 hover:border-[#261B6D] px-4 py-2 rounded-2xl transition-all">
          عرض الكل ←
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            categoryName={product.category.nameAr}
          />
        ))}
      </div>
    </section>
  );
}
