"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Plus, Minus, Star, Share2, Shield, Truck, RefreshCw, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import toast from "react-hot-toast";

interface ProductDetailProps {
  product: {
    id: string; nameAr: string; nameEn?: string | null; slug: string;
    descriptionAr?: string | null; price: number; salePrice?: number | null;
    stock: number; mainImage?: string | null; images: string[];
    isNew: boolean; isFeatured: boolean; tags: string[];
    category: { nameAr: string; slug: string };
    reviews: Array<{ id: string; rating: number; comment?: string | null; user: { name?: string | null } }>;
    _count: { reviews: number };
  };
  related: any[];
}

export function ProductDetail({ product, related }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem, openCart } = useCartStore();

  const allImages = product.mainImage
    ? [product.mainImage, ...product.images.filter((i) => i !== product.mainImage)]
    : product.images;

  const discountPercent = calculateDiscountPercent(product.price, product.salePrice ?? product.price);
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  const handleAddToCart = () => {
    addItem({ id: product.id, nameAr: product.nameAr, price: product.price, salePrice: product.salePrice, mainImage: product.mainImage, stock: product.stock, slug: product.slug }, quantity);
    toast.success(`تمت إضافة ${quantity} قطعة للسلة 🛒`);
    openCart();
  };

  return (
    <div className="container-custom py-8">
      {/* مسار التنقل */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-orange-500">الرئيسية</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-orange-500">{product.category.nameAr}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.nameAr}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* الصور */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden">
            {allImages[activeImage] ? (
              <Image src={allImages[activeImage]} alt={product.nameAr} fill className="object-contain" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl text-gray-200">📦</div>
            )}
            {discountPercent > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white font-black text-lg px-3 py-1 rounded-full">
                -{discountPercent}%
              </div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-orange-400" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt={`${product.nameAr} - صورة ${i + 1}`} width={80} height={80} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* التفاصيل */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-sm text-orange-500 font-medium mb-1">{product.category.nameAr}</p>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{product.nameAr}</h1>
            </div>
            <button aria-label="مشاركة المنتج" className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 flex-shrink-0">
              <Share2 size={18} className="text-gray-500" />
            </button>
          </div>

          {/* التقييم */}
          {product._count.reviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} size={16} className={i <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                ))}
              </div>
              <span className="text-sm text-gray-600">{avgRating.toFixed(1)} ({product._count.reviews} تقييم)</span>
            </div>
          )}

          {/* السعر */}
          <div className="bg-orange-50 rounded-2xl p-5 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-orange-500">
                {formatPrice(product.salePrice ?? product.price)}
              </span>
              {product.salePrice && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
            </div>
            {discountPercent > 0 && (
              <p className="text-sm text-green-600 font-semibold mt-1">
                💰 توفر {formatPrice(product.price - (product.salePrice || 0))} ({discountPercent}% خصم)
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">السعر شامل ضريبة القيمة المضافة 15%</p>
          </div>

          {/* المخزون */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 5 ? "bg-green-500" : product.stock > 0 ? "bg-yellow-500" : "bg-red-500"}`} />
            <span className={`text-sm font-medium ${product.stock > 5 ? "text-green-700" : product.stock > 0 ? "text-yellow-700" : "text-red-700"}`}>
              {product.stock > 5 ? "متوفر في المخزون" : product.stock > 0 ? `آخر ${product.stock} قطع فقط!` : "نفذ المخزون"}
            </span>
          </div>

          {/* الكمية */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-700">الكمية:</span>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-xs text-gray-500">أقصى: {product.stock}</span>
            </div>
          )}

          {/* أزرار الشراء */}
          <div className="flex gap-3 mb-8">
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart size={20} />
              {product.stock > 0 ? "أضف للسلة" : "نفذ المخزون"}
            </button>
            <Link href="/checkout" className="flex-1 btn-secondary flex items-center justify-center gap-2 py-4 text-base" onClick={() => {
              if (product.stock > 0) {
                addItem({ id: product.id, nameAr: product.nameAr, price: product.price, salePrice: product.salePrice, mainImage: product.mainImage, stock: product.stock, slug: product.slug }, quantity);
              }
            }}>
              اشترِ الآن
            </Link>
          </div>

          {/* ضمانات */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, title: "توصيل سريع", desc: "24-48 ساعة" },
              { icon: Shield, title: "ضمان الجودة", desc: "سنة كاملة" },
              { icon: RefreshCw, title: "إرجاع مجاني", desc: "7 أيام" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                <Icon size={20} className="text-orange-500 mb-1.5" />
                <p className="text-xs font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الوصف */}
      {product.descriptionAr && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">وصف المنتج</h2>
          <p className="text-gray-600 leading-relaxed text-sm">{product.descriptionAr}</p>
        </div>
      )}

      {/* التقييمات */}
      {product.reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            آراء العملاء ({product._count.reviews})
          </h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                    {review.user.name?.[0] || "م"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.user.name || "مستخدم"}</p>
                    <div className="flex">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} size={12} className={i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                </div>
                {review.comment && <p className="text-sm text-gray-600 mr-12">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* منتجات مشابهة */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} {...p} categoryName={p.category.nameAr} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
