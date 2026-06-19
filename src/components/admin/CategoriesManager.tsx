"use client";
import { useState } from "react";
import { Plus, Edit, Tag } from "lucide-react";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

interface CategoryRow {
  id: string;
  nameAr: string;
  nameEn: string | null;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { products: number };
}

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingCategory = categories.find((c) => c.id === editingId) || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* قائمة التصنيفات */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">التصنيفات الحالية</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Tag size={16} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{cat.nameAr}</p>
                  <p className="text-xs text-gray-500">{cat._count.products} منتج • /{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${cat.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {cat.isActive ? "نشط" : "مخفي"}
                </span>
                <button
                  onClick={() => setEditingId(cat.id)}
                  className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-500"
                  title="تعديل"
                  aria-label={`تعديل ${cat.nameAr}`}
                >
                  <Edit size={15} />
                </button>
                <DeleteCategoryButton categoryId={cat.id} categoryName={cat.nameAr} productCount={cat._count.products} />
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">لا توجد تصنيفات</div>
          )}
        </div>
      </div>

      {/* نموذج إضافة/تعديل تصنيف */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          {editingCategory ? <><Edit size={18} className="text-blue-500" />تعديل "{editingCategory.nameAr}"</> : <><Plus size={18} className="text-orange-500" />إضافة تصنيف جديد</>}
        </h2>
        <CategoryForm editingCategory={editingCategory} onDoneEditing={() => setEditingId(null)} />
      </div>
    </div>
  );
}
