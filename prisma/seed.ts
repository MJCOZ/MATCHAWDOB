import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء إضافة البيانات الأولية...");

  // ===================================================
  // 1. التصنيفات
  // ===================================================
  const [matchaPowderCat, matchaToolsCat, drinksCat, accessoriesCat, giftsCat] =
    await Promise.all([
      prisma.category.upsert({
        where: { slug: "matcha-powder" },
        update: {},
        create: {
          nameAr: "ماتشا بودر", nameEn: "Matcha Powder",
          slug: "matcha-powder",
          description: "أفضل أنواع مسحوق الماتشا الياباني الأصيل",
          isActive: true, sortOrder: 1,
        },
      }),
      prisma.category.upsert({
        where: { slug: "matcha-tools" },
        update: {},
        create: {
          nameAr: "أدوات الماتشا", nameEn: "Matcha Tools",
          slug: "matcha-tools",
          description: "أدوات التحضير الأصيلة للماتشا الياباني",
          isActive: true, sortOrder: 2,
        },
      }),
      prisma.category.upsert({
        where: { slug: "drinks" },
        update: {},
        create: {
          nameAr: "مشروبات", nameEn: "Drinks",
          slug: "drinks",
          description: "مشروبات الماتشا الجاهزة والمستلزمات",
          isActive: true, sortOrder: 3,
        },
      }),
      prisma.category.upsert({
        where: { slug: "accessories" },
        update: {},
        create: {
          nameAr: "إكسسوارات", nameEn: "Accessories",
          slug: "accessories",
          description: "إكسسوارات MatchaWoob المميزة",
          isActive: true, sortOrder: 4,
        },
      }),
      prisma.category.upsert({
        where: { slug: "gifts" },
        update: {},
        create: {
          nameAr: "هدايا", nameEn: "Gifts",
          slug: "gifts",
          description: "أطقم هدايا MatchaWoob الفاخرة",
          isActive: true, sortOrder: 5,
        },
      }),
    ]);

  console.log("✅ تم إنشاء 5 تصنيفات");

  // ===================================================
  // 2. المنتجات
  // ===================================================
  const products = [
    // ماتشا بودر
    {
      nameAr: "ماتشا سيريمونيال غريد - 30 جرام",
      nameEn: "Ceremonial Grade Matcha 30g",
      slug: "matcha-ceremonial-30g",
      descriptionAr: "أرقى أنواع الماتشا الياباني من مزارع أوجي المشهورة. لون أخضر زاهٍ ونكهة ناعمة وحلوة من أجود ما أنتجته اليابان.",
      price: 120, salePrice: null, stock: 50,
      categoryId: matchaPowderCat.id,
      isFeatured: true, isNew: true, sku: "MW-MPO-001", weight: 0.05,
    },
    {
      nameAr: "ماتشا كوليناري غريد - 100 جرام",
      nameEn: "Culinary Grade Matcha 100g",
      slug: "matcha-culinary-100g",
      descriptionAr: "ماتشا للطهي والعجائن والمشروبات. مثالي لصنع لاتيه الماتشا والكيك والآيس كريم. نكهة قوية ومميزة.",
      price: 85, salePrice: 65, stock: 80,
      categoryId: matchaPowderCat.id,
      isFeatured: true, isNew: false, sku: "MW-MPO-002", weight: 0.12,
    },
    {
      nameAr: "ماتشا برميوم ليف - 50 جرام",
      nameEn: "Premium Leaf Matcha 50g",
      slug: "matcha-premium-50g",
      descriptionAr: "ماتشا ممتاز من أوراق الشاي الكاملة المطحونة. توازن مثالي بين النكهة والجودة.",
      price: 95, salePrice: null, stock: 40,
      categoryId: matchaPowderCat.id,
      isFeatured: false, isNew: true, sku: "MW-MPO-003", weight: 0.07,
    },
    {
      nameAr: "ماتشا ستارتر باك - 20 جرام",
      nameEn: "Matcha Starter Pack 20g",
      slug: "matcha-starter-20g",
      descriptionAr: "للمبتدئين في عالم الماتشا! يأتي مع دليل التحضير الياباني التقليدي.",
      price: 55, salePrice: 45, stock: 100,
      categoryId: matchaPowderCat.id,
      isFeatured: false, isNew: false, sku: "MW-MPO-004", weight: 0.03,
    },
    // أدوات الماتشا
    {
      nameAr: "شاسين - مخفقة الماتشا التقليدية",
      nameEn: "Bamboo Matcha Whisk Chasen",
      slug: "matcha-whisk-chasen",
      descriptionAr: "مخفقة خيزران تقليدية يابانية (شاسين) لإعداد الماتشا الأصيل. 80 خيطاً لرغوة ناعمة مثالية.",
      price: 75, salePrice: null, stock: 35,
      categoryId: matchaToolsCat.id,
      isFeatured: true, isNew: false, sku: "MW-TOL-001", weight: 0.08,
    },
    {
      nameAr: "شاوان - طاسة الماتشا الخزفية",
      nameEn: "Matcha Bowl Chawan",
      slug: "matcha-bowl-chawan",
      descriptionAr: "طاسة خزفية يابانية تقليدية (شاوان) لتحضير وتقديم الماتشا. تصميم MatchaWoob الحصري.",
      price: 140, salePrice: 110, stock: 25,
      categoryId: matchaToolsCat.id,
      isFeatured: true, isNew: true, sku: "MW-TOL-002", weight: 0.35,
    },
    {
      nameAr: "شاكوزيتسو - ملعقة الماتشا",
      nameEn: "Bamboo Matcha Scoop Chashaku",
      slug: "matcha-scoop-chashaku",
      descriptionAr: "ملعقة خيزران تقليدية للقياس الدقيق لمسحوق الماتشا. مصنوعة يدوياً.",
      price: 35, salePrice: null, stock: 60,
      categoryId: matchaToolsCat.id,
      isFeatured: false, isNew: false, sku: "MW-TOL-003", weight: 0.02,
    },
    {
      nameAr: "طقم أدوات الماتشا الكامل",
      nameEn: "Complete Matcha Tools Set",
      slug: "matcha-tools-complete-set",
      descriptionAr: "الطقم الكامل: شاسين + شاوان + شاكوزيتسو + علبة تخزين + دليل التحضير. هدية مثالية!",
      price: 295, salePrice: 239, stock: 20,
      categoryId: matchaToolsCat.id,
      isFeatured: true, isNew: true, sku: "MW-TOL-004", weight: 0.6,
    },
    // مشروبات
    {
      nameAr: "ماتشا لاتيه جاهز - 12 كيس",
      nameEn: "Matcha Latte Ready Mix 12pcs",
      slug: "matcha-latte-mix-12",
      descriptionAr: "خلطة ماتشا لاتيه جاهزة للتحضير. أضف الماء أو الحليب. نكهة كريمية ناعمة.",
      price: 68, salePrice: null, stock: 90,
      categoryId: drinksCat.id,
      isFeatured: false, isNew: true, sku: "MW-DRK-001", weight: 0.18,
    },
    {
      nameAr: "ماتشا بانج - 6 زجاجات",
      nameEn: "Matcha Bang 6 Bottles",
      slug: "matcha-bang-6pack",
      descriptionAr: "مشروب الماتشا الأيسد الجاهز. بدون سكر مضاف. منعش وطبيعي. 330مل لكل زجاجة.",
      price: 89, salePrice: 75, stock: 45,
      categoryId: drinksCat.id,
      isFeatured: true, isNew: false, sku: "MW-DRK-002", weight: 2.2,
    },
    // إكسسوارات
    {
      nameAr: "كوباية MatchaWoob الكيوت",
      nameEn: "MatchaWoob Cute Cup",
      slug: "matchawoob-cute-cup",
      descriptionAr: "كوباية زجاجية بطباعة شخصية الدب الياباني. مزدوجة الجدار. 400مل.",
      price: 95, salePrice: null, stock: 30,
      categoryId: accessoriesCat.id,
      isFeatured: true, isNew: true, sku: "MW-ACC-001", weight: 0.25,
    },
    {
      nameAr: "حقيبة MatchaWoob كانفاس",
      nameEn: "MatchaWoob Canvas Tote Bag",
      slug: "matchawoob-tote-bag",
      descriptionAr: "حقيبة كانفاس بطباعة الكائن الفضائي الأخضر. قطن عالي الجودة.",
      price: 65, salePrice: 52, stock: 55,
      categoryId: accessoriesCat.id,
      isFeatured: false, isNew: true, sku: "MW-ACC-002", weight: 0.15,
    },
    // هدايا
    {
      nameAr: "صندوق هدية MatchaWoob الفاخر",
      nameEn: "MatchaWoob Luxury Gift Box",
      slug: "matchawoob-luxury-gift-box",
      descriptionAr: "صندوق هدية فاخر: ماتشا سيريمونيال + طقم أدوات + شمعة ماتشا + بطاقة معايدة. تغليف MatchaWoob الحصري.",
      price: 450, salePrice: 389, stock: 15,
      categoryId: giftsCat.id,
      isFeatured: true, isNew: true, sku: "MW-GFT-001", weight: 1.2,
    },
    {
      nameAr: "صندوق هدية MatchaWoob الصغير",
      nameEn: "MatchaWoob Mini Gift Box",
      slug: "matchawoob-mini-gift-box",
      descriptionAr: "صندوق هدية صغير: ماتشا ستارتر + شاكوزيتسو + بطاقة معايدة. مثالي للمناسبات.",
      price: 145, salePrice: null, stock: 40,
      categoryId: giftsCat.id,
      isFeatured: false, isNew: false, sku: "MW-GFT-002", weight: 0.3,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        images: [],
        tags: ["ماتشا", "ياباني", "matchawoob"],
        isActive: true,
      },
    });
  }

  console.log(`✅ تم إنشاء ${products.length} منتج`);

  // ===================================================
  // 3. كوبونات الخصم
  // ===================================================
  await Promise.all([
    prisma.coupon.upsert({
      where: { code: "MATCHA10" },
      update: {},
      create: {
        code: "MATCHA10",
        descriptionAr: "خصم 10% على جميع المنتجات - كوبون الترحيب",
        type: "PERCENTAGE", value: 10, minOrderAmount: 50,
        usageLimit: 500, isActive: true,
      },
    }),
    prisma.coupon.upsert({
      where: { code: "WOOB20" },
      update: {},
      create: {
        code: "WOOB20",
        descriptionAr: "خصم 20 ريال على الطلبات فوق 150 ريال",
        type: "FIXED", value: 20, minOrderAmount: 150,
        usageLimit: 200, isActive: true,
      },
    }),
    prisma.coupon.upsert({
      where: { code: "SHIPFREE" },
      update: {},
      create: {
        code: "SHIPFREE",
        descriptionAr: "شحن مجاني على أي طلب",
        type: "FREE_SHIPPING", value: 0, minOrderAmount: 0,
        usageLimit: 100, isActive: true,
      },
    }),
  ]);

  console.log("✅ تم إنشاء 3 كوبونات خصم");

  // ===================================================
  // 4. حساب المدير
  // ===================================================
  const adminPassword = await bcrypt.hash("Admin@2024", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@matchawoob.sa" },
    update: {},
    create: {
      name: "مدير MatchaWoob",
      email: "admin@matchawoob.sa",
      password: adminPassword,
      role: "SUPER_ADMIN",
      phone: "+966500000000",
    },
  });

  console.log(`✅ تم إنشاء حساب المدير: ${admin.email}`);

  // ===================================================
  // 5. إعدادات المتجر
  // ===================================================
  const settings = [
    { key: "store_name", value: "MatchaWoob", group: "general" },
    { key: "store_name_ar", value: "متجر ماتشا والدب", group: "general" },
    { key: "store_phone", value: "+966500000000", group: "general" },
    { key: "store_email", value: "hello@matchawoob.sa", group: "general" },
    { key: "store_address", value: "الرياض، المملكة العربية السعودية", group: "general" },
    { key: "vat_rate", value: "15", group: "pricing" },
    { key: "free_shipping_threshold", value: "200", group: "shipping" },
    { key: "default_shipping_cost", value: "25", group: "shipping" },
    { key: "currency", value: "SAR", group: "pricing" },
    { key: "currency_symbol", value: "ر.س", group: "pricing" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log(`✅ تم إنشاء ${settings.length} إعداد`);

  console.log("\n🎉 اكتملت عملية الـ Seed بنجاح!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔗 المتجر:          http://localhost:3000");
  console.log("🔧 لوحة التحكم:     http://localhost:3000/admin");
  console.log("📧 الإيميل:         admin@matchawoob.sa");
  console.log("🔑 كلمة المرور:     Admin@2024");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
