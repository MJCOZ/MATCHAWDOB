import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { nameAr: "asc" },
    select: { id: true, nameAr: true, slug: true },
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">إضافة منتج جديد</h1>
        <p className="text-gray-500 text-sm mt-0.5">أدخل بيانات المنتج الجديد</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
