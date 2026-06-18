export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Trash2, Package, AlertCircle } from "lucide-react";
import Image from "next/image";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

interface SearchParams {
  page?: string;
  q?: string;
  category?: string;
  lowStock?: string;
}

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, parseInt(searchParams.page || "1") || 1);
  const limit = 15;

  const where: any = {};
  if (searchParams.q) where.OR = [
    { nameAr: { contains: searchParams.q, mode: "insensitive" } },
    { sku: { contains: searchParams.q, mode: "insensitive" } },
  ];
  if (searchParams.category) {
    const cat = await prisma.category.findUnique({ where: { slug: searchParams.category } });
    if (cat) where.categoryId = cat.id;
  }
  if (searchParams.lowStock === "true") where.stock = { lte: 5 };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { category: { select: { nameAr: true } } },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, select: { nameAr: true, slug: true } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">إدارة المنتجات</h1>
          <p className="text-gray-500 text-sm">{total} منتج</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          إضافة منتج
        </Link>
      </div>

      {/* البحث والفلاتر */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <form className="flex flex-wrap gap-3">
          <input
            type="text"
            name="q"
            placeholder="ابحث باسم المنتج أو SKU..."
            defaultValue={searchParams.q}
            className="input-field flex-1 min-w-48 py-2"
          />
          <select name="category" defaultValue={searchParams.category} className="input-field w-auto py-2">
            <option value="">جميع التصنيفات</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.nameAr}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" name="lowStock" value="true" defaultChecked={searchParams.lowStock === "true"} className="accent-orange-500 w-4 h-4" />
            مخزون منخفض
          </label>
          <button type="submit" className="btn-primary py-2 px-5">بحث</button>
        </form>
      </div>

      {/* جدول المنتجات */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-4">المنتج</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-4">التصنيف</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-4">السعر</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-4">المخزون</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-4">الحالة</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                        {product.mainImage ? (
                          <Image src={product.mainImage} alt={product.nameAr} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{product.nameAr}</p>
                        {product.sku && <p className="text-xs text-gray-500">SKU: {product.sku}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{product.category.nameAr}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(Number(product.price))}</p>
                    {product.salePrice && (
                      <p className="text-xs text-red-500 font-medium">{formatPrice(Number(product.salePrice))}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {product.stock <= 5 && product.stock > 0 && (
                        <AlertCircle size={14} className="text-yellow-500" />
                      )}
                      {product.stock === 0 && (
                        <AlertCircle size={14} className="text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        product.stock === 0 ? "text-red-500"
                        : product.stock <= 5 ? "text-yellow-600"
                        : "text-green-600"
                      }`}>
                        {product.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {product.isActive ? "نشط" : "مخفي"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-500"
                        title="تعديل"
                      >
                        <Edit size={16} />
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.nameAr} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-20">
              <Package size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">لا توجد منتجات</p>
            </div>
          )}
        </div>
      </div>

      {/* الصفحات */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?${new URLSearchParams({ ...searchParams, page: p.toString() })}`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${
                p === page ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-700 hover:border-orange-300"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
