import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetail } from "@/components/shop/ProductDetail";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return { title: "المنتج غير موجود" };
  return {
    title: product.nameAr,
    description: product.descriptionAr || `اشترِ ${product.nameAr} من متجرنا`,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      category: true,
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: { where: { isApproved: true } } } },
    },
  });

  if (!product) notFound();

  // منتجات مشابهة
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
      stock: { gt: 0 },
    },
    take: 4,
    include: { category: { select: { nameAr: true, slug: true } } },
  });

  const serialized = {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    cost: product.cost ? Number(product.cost) : null,
    weight: product.weight ? Number(product.weight) : null,
    images: Array.isArray(product.images) ? product.images : JSON.parse(product.images as string || "[]"),
  };

  const serializedRelated = related.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    images: [],
  }));

  return <ProductDetail product={serialized as any} related={serializedRelated as any} />;
}
