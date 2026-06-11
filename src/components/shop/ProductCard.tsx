"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductCardProps {
  id: string;
  nameAr: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  mainImage?: string | null;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  categoryName?: string;
}

export function ProductCard({
  id, nameAr, slug, price, salePrice, mainImage,
  stock, isFeatured, isNew, categoryName
}: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const displayPrice      = salePrice ?? price;
  const discountPercent   = calculateDiscountPercent(price, salePrice ?? price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stock <= 0) return;
    addItem({ id, nameAr, price, salePrice, mainImage, stock, slug });
    toast.success(`تمت إضافة "${nameAr}" للسلة 🍵`);
    openCart();
  };

  return (
    <Link href={`/products/${slug}`} className="product-card group">

      {/* صورة المنتج */}
      <div className="relative overflow-hidden aspect-square"
        style={{ background: "#FAFAF5", borderBottom: "2px solid #1a1a1a" }}>
        {mainImage ? (
          <Image src={mainImage} alt={nameAr} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl opacity-50">🍵</span>
          </div>
        )}

        {/* الشارات */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="text-xs font-black text-white px-2.5 py-1"
              style={{ background: "#ff3b3b", border: "1.5px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a", borderRadius: "2px" }}>
              -{discountPercent}%
            </span>
          )}
          {isNew && !discountPercent && (
            <span className="text-xs font-black text-[#261B6D] px-2.5 py-1"
              style={{ background: "#B2DE81", border: "1.5px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a", borderRadius: "2px" }}>
              ✦ جديد
            </span>
          )}
          {stock === 0 && (
            <span className="text-xs font-black text-white px-2.5 py-1"
              style={{ background: "#6b7280", border: "1.5px solid #1a1a1a", borderRadius: "2px" }}>
              نفذ
            </span>
          )}
        </div>

        {/* زر المفضلة */}
        <button onClick={e => e.preventDefault()}
          className="absolute top-3 left-3 w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a", borderRadius: "4px" }}>
          <Heart size={15} className="text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        {/* زر الإضافة للسلة */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={handleAddToCart} disabled={stock === 0}
            className="w-full font-black text-white text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
            style={{
              background: stock === 0 ? "#6b7280" : "#261B6D",
              border: "2px solid #1a1a1a",
              boxShadow: "3px 3px 0 #1a1a1a",
              borderRadius: "4px",
            }}
            onMouseEnter={e => { if (stock > 0) { (e.currentTarget as HTMLElement).style.background = "#B2DE81"; (e.currentTarget as HTMLElement).style.color = "#261B6D"; } }}
            onMouseLeave={e => { if (stock > 0) { (e.currentTarget as HTMLElement).style.background = "#261B6D"; (e.currentTarget as HTMLElement).style.color = "#ffffff"; } }}
          >
            <ShoppingCart size={15} />
            {stock === 0 ? "نفذ المخزون" : "أضف للسلة"}
          </button>
        </div>
      </div>

      {/* تفاصيل المنتج */}
      <div className="p-4">
        {categoryName && (
          <p className="text-xs font-black text-[#261B6D]/50 mb-1 uppercase tracking-wide font-en">{categoryName}</p>
        )}
        <h3 className="font-bold text-gray-900 text-sm leading-relaxed line-clamp-2 mb-2 group-hover:text-[#261B6D] transition-colors">
          {nameAr}
        </h3>

        {/* التقييم */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className={i < 4 ? "fill-[#B2DE81] text-[#B2DE81]" : "text-gray-300"} />
          ))}
          <span className="text-xs text-gray-400 mr-1">(24)</span>
        </div>

        {/* السعر */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-[#261B6D] font-en">{formatPrice(displayPrice)}</span>
            {salePrice && (
              <span className="text-sm text-gray-400 line-through font-en">{formatPrice(price)}</span>
            )}
          </div>
          {stock > 0 && stock <= 5 && (
            <span className="text-xs font-black text-[#ff3b3b]"
              style={{ background: "#fff0f0", border: "1px solid #ff3b3b", padding: "2px 6px", borderRadius: "2px" }}>
              آخر {stock}!
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
