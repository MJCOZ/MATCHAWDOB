export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ where: { isActive: true }, select: { id: true, nameAr: true, slug: true } }),
  ]);

  if (!product) notFound();

  const serialized = {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    cost: product.cost ? Number(product.cost) : null,
    weight: product.weight ? Number(product.weight) : null,
    images: Array.isArray(product.images) ? product.images : JSON.parse(product.images as string || "[]"),
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">تعديل المنتج</h1>
        <p className="text-gray-500 text-sm mt-0.5">{product.nameAr}</p>
      </div>
      <ProductForm categories={categories} initialData={serialized} />
    </div>
  );
}
