import Link from "next/link";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string; nameAr: string; slug: string;
  price: number; salePrice?: number | null; mainImage?: string | null;
  stock: number; isFeatured: boolean; isNew: boolean;
  category: { nameAr: string; slug: string };
}

export function NewProducts({ products }: { products: Product[] }) {
  return (
    <section className="container-custom py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="section-tag mb-3 inline-flex">
            <span>✦</span> NEW ARRIVAL
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#261B6D] mt-2">منتجات جديدة</h2>
          <p className="text-gray-500 text-sm mt-1">أحدث ما وصلنا من عالم الماتشا</p>
        </div>
        <Link href="/products?new=true"
          className="text-[#261B6D] text-sm font-black px-5 py-2.5 transition-all"
          style={{ border: "2px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a", borderRadius: "4px" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "5px 5px 0 #1a1a1a"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0 #1a1a1a"; }}
        >
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
