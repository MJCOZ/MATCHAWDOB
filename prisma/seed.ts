// ================================================
// ملف بيانات أولية للمتجر
// تشغيل: npm run db:seed
// ================================================
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء إضافة البيانات الأولية...");

  // إنشاء مستخدم أدمن
  const adminPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@saudistore.sa" },
    update: {},
    create: {
      name: "مدير المتجر",
      email: "admin@saudistore.sa",
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
    },
  });
  console.log("✅ تم إنشاء حساب الأدمن:", admin.email);

  // إنشاء تصنيفات
  const categories = [
    { nameAr: "إلكترونيات", nameEn: "Electronics", slug: "electronics", image: "/images/categories/electronics.jpg" },
    { nameAr: "ملابس رجالية", nameEn: "Men's Clothing", slug: "mens-clothing", image: "/images/categories/mens.jpg" },
    { nameAr: "ملابس نسائية", nameEn: "Women's Clothing", slug: "womens-clothing", image: "/images/categories/womens.jpg" },
    { nameAr: "المنزل والمطبخ", nameEn: "Home & Kitchen", slug: "home-kitchen", image: "/images/categories/home.jpg" },
    { nameAr: "العناية الشخصية", nameEn: "Personal Care", slug: "personal-care", image: "/images/categories/care.jpg" },
    { nameAr: "الرياضة", nameEn: "Sports", slug: "sports", image: "/images/categories/sports.jpg" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ تم إنشاء التصنيفات");

  // جلب الإلكترونيات
  const electronics = await prisma.category.findUnique({ where: { slug: "electronics" } });

  // إنشاء منتجات تجريبية
  const products = [
    {
      nameAr: "سماعات بلوتوث لاسلكية",
      nameEn: "Wireless Bluetooth Headphones",
      slug: "wireless-bluetooth-headphones",
      descriptionAr: "سماعات بلوتوث عالية الجودة مع خاصية إلغاء الضوضاء وعمر بطارية يصل إلى 30 ساعة",
      price: 299.99,
      salePrice: 199.99,
      stock: 50,
      categoryId: electronics!.id,
      isFeatured: true,
      isNew: true,
      mainImage: "/images/products/headphones.jpg",
      images: JSON.stringify(["/images/products/headphones.jpg"]),
    },
    {
      nameAr: "ساعة ذكية Pro",
      nameEn: "Smart Watch Pro",
      slug: "smart-watch-pro",
      descriptionAr: "ساعة ذكية متطورة مع رصد معدل ضربات القلب وتتبع النشاط البدني",
      price: 499.99,
      salePrice: 399.99,
      stock: 30,
      categoryId: electronics!.id,
      isFeatured: true,
      mainImage: "/images/products/smartwatch.jpg",
      images: JSON.stringify(["/images/products/smartwatch.jpg"]),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product as any,
    });
  }
  console.log("✅ تم إنشاء المنتجات التجريبية");

  // إنشاء كوبون خصم تجريبي
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      descriptionAr: "خصم 10% للعملاء الجدد",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 100,
      usageLimit: 100,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "SAVE50" },
    update: {},
    create: {
      code: "SAVE50",
      descriptionAr: "خصم 50 ريال على الطلبات فوق 300 ريال",
      type: "FIXED",
      value: 50,
      minOrderAmount: 300,
      usageLimit: 50,
      isActive: true,
    },
  });
  console.log("✅ تم إنشاء كوبونات الخصم");

  // إعدادات المتجر الافتراضية
  const settings = [
    { key: "store_name", value: "متجر الخير", group: "general" },
    { key: "store_phone", value: "+966500000000", group: "general" },
    { key: "store_email", value: "info@saudistore.sa", group: "general" },
    { key: "store_address", value: "الرياض، المملكة العربية السعودية", group: "general" },
    { key: "currency", value: "SAR", group: "general" },
    { key: "vat_rate", value: "15", group: "tax" },
    { key: "free_shipping_threshold", value: "200", group: "shipping" },
    { key: "default_shipping_cost", value: "30", group: "shipping" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✅ تم إنشاء إعدادات المتجر");

  console.log("\n🎉 انتهت عملية إضافة البيانات بنجاح!");
  console.log("📧 البريد: admin@saudistore.sa");
  console.log("🔑 كلمة المرور: Admin@123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
