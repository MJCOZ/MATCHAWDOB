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
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">منتجات مميزة</h2>
          <p className="text-gray-500 text-sm mt-1">اختيار خبراء التسوق</p>
        </div>
        <Link href="/products?featured=true" className="text-orange-500 hover:text-orange-600 text-sm font-semibold">
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
