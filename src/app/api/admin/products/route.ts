export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  return session?.user && (role === "ADMIN" || role === "SUPER_ADMIN");
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  try {
    const body = await req.json();
    const validation = productSchema.safeParse(body);
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });

    const { nameAr, ...data } = validation.data;
    const slug = body.slug || slugify(nameAr);

    const product = await prisma.product.create({
      data: {
        nameAr,
        ...data,
        slug,
        mainImage: body.mainImage || null,
        images: body.images || [],
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "منتج بهذا الاسم موجود بالفعل" }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
