export const dynamic = 'force-dynamic';
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

  const description = product.descriptionAr || `اشترِ ${product.nameAr} من متجرنا`;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/products/${product.slug}`;
  const image = product.mainImage || undefined;

  return {
    title: product.nameAr,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: product.nameAr,
      description,
      url,
      images: image ? [{ url: image }] : undefined,
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nameAr,
    description: product.descriptionAr || undefined,
    image: product.mainImage || undefined,
    sku: product.sku || undefined,
    category: product.category.nameAr,
    offers: {
      "@type": "Offer",
      priceCurrency: "SAR",
      price: Number(product.salePrice ?? product.price),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={serialized as any} related={serializedRelated as any} />
    </>
  );
}
