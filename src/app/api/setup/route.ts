export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  // يشتغل فقط إذا لم يوجد أي مدير في قاعدة البيانات
  const adminExists = await prisma.user.findFirst({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
  });

  if (adminExists) {
    return NextResponse.json(
      { error: "✅ حساب المدير موجود بالفعل. ادخل من صفحة تسجيل الدخول." },
      { status: 400 }
    );
  }

  // حماية بسيطة: يشتغل فقط مرة واحدة ولا يوجد مدير
  // لا نحتاج secret لأن الشرط الوحيد هو عدم وجود أي مدير
  const hashedPassword = await bcrypt.hash("Admin@2024", 12);

  const admin = await prisma.user.create({
    data: {
      name: "مدير MatchaWdob",
      email: "admin@matchwdob.sa",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      phone: "+966500000000",
    },
  });

  // إنشاء الإعدادات الأساسية
  const settings = [
    { key: "store_name",       value: "MatchaWdob",                    group: "general"  },
    { key: "store_name_ar",    value: "متجر ماتشا والدب",              group: "general"  },
    { key: "store_phone",      value: "+966500000000",                  group: "general"  },
    { key: "store_email",      value: "hello@matchwdob.sa",             group: "general"  },
    { key: "store_address",    value: "الرياض، المملكة العربية السعودية", group: "general" },
    { key: "vat_rate",         value: "15",                             group: "pricing"  },
    { key: "free_shipping_threshold", value: "200",                     group: "shipping" },
    { key: "default_shipping_cost",   value: "25",                      group: "shipping" },
    { key: "currency",         value: "SAR",                            group: "pricing"  },
    { key: "currency_symbol",  value: "ر.س",                            group: "pricing"  },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where:  { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // إنشاء التصنيفات الأساسية
  const cats = [
    { nameAr: "ماتشا بودر",  nameEn: "Matcha Powder", slug: "matcha-powder", sortOrder: 1 },
    { nameAr: "أدوات الماتشا", nameEn: "Matcha Tools", slug: "matcha-tools", sortOrder: 2 },
    { nameAr: "مشروبات",     nameEn: "Drinks",         slug: "drinks",       sortOrder: 3 },
    { nameAr: "إكسسوارات",  nameEn: "Accessories",    slug: "accessories",  sortOrder: 4 },
    { nameAr: "هدايا",       nameEn: "Gifts",          slug: "gifts",        sortOrder: 5 },
  ];

  for (const c of cats) {
    await prisma.category.upsert({
      where:  { slug: c.slug },
      update: {},
      create: { ...c, isActive: true },
    });
  }

  return NextResponse.json({
    success: true,
    message: "✅ تم إنشاء حساب المدير والإعدادات الأساسية بنجاح!",
    credentials: {
      email: admin.email,
      password: "Admin@2024",
      loginUrl: "/login",
      note: "غيّر كلمة المرور فور الدخول لأول مرة",
    },
  });
}
