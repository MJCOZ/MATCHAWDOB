"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Category {
  id: string;
  nameAr: string;
  slug: string;
}

interface FilterProps {
  categories: Category[];
  currentParams: Record<string, string | undefined>;
}

export function ProductFilters({ categories, currentParams }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* التصنيفات */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span>
          التصنيفات
        </h3>
        <div className="space-y-1">
          <Link
            href="/products"
            className={`block text-sm px-3 py-2 rounded-lg transition-colors ${
              !currentParams.category ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            جميع المنتجات
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`block text-sm px-3 py-2 rounded-lg transition-colors ${
                currentParams.category === cat.slug ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.nameAr}
            </Link>
          ))}
        </div>
      </div>

      {/* نطاق السعر */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span>
          السعر
        </h3>
        <div className="space-y-2">
          {[
            { label: "أقل من 100 ريال", min: "", max: "100" },
            { label: "100 - 300 ريال", min: "100", max: "300" },
            { label: "300 - 500 ريال", min: "300", max: "500" },
            { label: "أكثر من 500 ريال", min: "500", max: "" },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => {
                updateFilter("minPrice", range.min || null);
                updateFilter("maxPrice", range.max || null);
              }}
              className={`block text-sm w-full text-right px-3 py-2 rounded-lg transition-colors ${
                currentParams.minPrice === range.min && currentParams.maxPrice === range.max
                  ? "bg-orange-50 text-orange-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* فلاتر إضافية */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span>
          فلاتر إضافية
        </h3>
        <div className="space-y-2">
          {[
            { label: "العروض فقط 🔥", key: "sale", value: "true" },
            { label: "منتجات جديدة ✨", key: "new", value: "true" },
            { label: "منتجات مميزة ⭐", key: "featured", value: "true" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => updateFilter(filter.key, currentParams[filter.key] === filter.value ? null : filter.value)}
              className={`flex items-center gap-2 text-sm w-full px-3 py-2 rounded-lg transition-colors ${
                currentParams[filter.key] === filter.value
                  ? "bg-orange-50 text-orange-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className={`w-4 h-4 rounded border ${currentParams[filter.key] === filter.value ? "bg-orange-500 border-orange-500" : "border-gray-300"} flex items-center justify-center`}>
                {currentParams[filter.key] === filter.value && <span className="text-white text-xs">✓</span>}
              </div>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* مسح الفلاتر */}
      {Object.keys(currentParams).some((k) => currentParams[k]) && (
        <Link
          href="/products"
          className="block text-center text-sm text-red-500 hover:text-red-600 font-medium py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          مسح جميع الفلاتر
        </Link>
      )}
    </div>
  );

  return (
    <>
      {/* الجوال - زر الفلاتر */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700"
        >
          <div className="flex items-center gap-2">
            <Filter size={16} />
            تصفية المنتجات
          </div>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mt-2">
            <FilterContent />
          </div>
        )}
      </div>

      {/* الكمبيوتر - الشريط الجانبي */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
        <h2 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
          <Filter size={18} className="text-orange-500" />
          تصفية المنتجات
        </h2>
        <FilterContent />
      </div>
    </>
  );
}
