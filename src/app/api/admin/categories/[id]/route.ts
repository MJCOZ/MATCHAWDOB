export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  return session?.user && (role === "ADMIN" || role === "SUPER_ADMIN");
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  try {
    const body = await req.json();
    const validation = categorySchema.safeParse(body);
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });

    const { nameAr, ...data } = validation.data;
    const slug = body.slug || slugify(nameAr);

    const category = await prisma.category.update({
      where: { id: params.id },
      data: { nameAr, ...data, slug },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "تصنيف بهذا الاسم موجود بالفعل" }, { status: 400 });
    console.error("Category update error:", error);
    return NextResponse.json({ error: "حدث خطأ في التحديث" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "تم الحذف" });
  } catch (error: any) {
    console.error("Category delete error:", error);
    return NextResponse.json({ error: "لا يمكن حذف التصنيف - قد يحتوي على منتجات أو تصنيفات فرعية" }, { status: 400 });
  }
}
