export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">إدارة التصنيفات</h1>
          <p className="text-gray-500 text-sm">{categories.length} تصنيف</p>
        </div>
      </div>

      <CategoriesManager categories={categories} />
    </div>
  );
}
