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
  const displayPrice = salePrice ?? price;
  const discountPercent = calculateDiscountPercent(price, salePrice ?? price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stock <= 0) return;

    addItem({
      id, nameAr, price, salePrice,
      mainImage, stock, slug,
    });
    toast.success(`تمت إضافة "${nameAr}" للسلة`, {
      icon: "🛒",
      style: {
        background: "#1f2937",
        color: "#fff",
      },
    });
    openCart();
  };

  return (
    <Link href={`/products/${slug}`} className="product-card block">
      {/* صورة المنتج */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={nameAr}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl text-gray-300">
            📦
          </div>
        )}

        {/* الشارات */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="badge-sale shadow-sm">-{discountPercent}%</span>
          )}
          {isNew && !discountPercent && (
            <span className="badge-new shadow-sm">جديد</span>
          )}
          {stock === 0 && (
            <span className="badge bg-gray-600 text-white shadow-sm">نفذ المخزون</span>
          )}
        </div>

        {/* زر المفضلة */}
        <button
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-3 left-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        >
          <Heart size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        {/* زر الإضافة للسلة */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="w-full bg-gray-900 hover:bg-orange-500 disabled:bg-gray-400 text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart size={16} />
            {stock === 0 ? "نفذ المخزون" : "أضف للسلة"}
          </button>
        </div>
      </div>

      {/* تفاصيل المنتج */}
      <div className="p-4">
        {categoryName && (
          <p className="text-xs text-orange-500 font-medium mb-1">{categoryName}</p>
        )}
        <h3 className="font-semibold text-gray-900 text-sm leading-relaxed line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
          {nameAr}
        </h3>

        {/* التقييم */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
          ))}
          <span className="text-xs text-gray-500 mr-1">(24)</span>
        </div>

        {/* السعر */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-orange-500">{formatPrice(displayPrice)}</span>
            {salePrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>
            )}
          </div>
          {stock > 0 && stock <= 5 && (
            <span className="text-xs text-red-500 font-medium">آخر {stock} قطع!</span>
          )}
        </div>
      </div>
    </Link>
  );
}
