# 🛒 متجر الخير - دليل التشغيل الشامل

## نظرة عامة على المشروع

متجر إلكتروني احترافي كامل مبني بأحدث التقنيات، مناسب للسوق السعودي مع دعم كامل للغة العربية.

### التقنيات المستخدمة:
- **Next.js 14** - إطار العمل الرئيسي (App Router)
- **TypeScript** - لضمان جودة الكود
- **Tailwind CSS** - للتصميم الاستجابي
- **Prisma** - ORM لقاعدة البيانات
- **PostgreSQL** - قاعدة البيانات
- **NextAuth.js** - نظام المصادقة
- **Zod** - التحقق من البيانات
- **Zustand** - إدارة حالة سلة التسوق

---

## 1. متطلبات التشغيل

```bash
Node.js >= 18.0.0
PostgreSQL >= 14
npm >= 9.0.0
```

---

## 2. تثبيت المشروع

```bash
# نسخ المشروع
git clone <repo-url>
cd saudi-ecommerce-store

# تثبيت المكتبات
npm install

# نسخ ملف المتغيرات البيئية
cp .env.example .env
```

---

## 3. إعداد قاعدة البيانات

### تثبيت PostgreSQL محلياً:
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# حمّل من: https://www.postgresql.org/download/windows/
```

### إنشاء قاعدة البيانات:
```bash
psql -U postgres
CREATE DATABASE saudi_store;
CREATE USER store_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE saudi_store TO store_user;
\q
```

### تحديث .env:
```env
DATABASE_URL="postgresql://store_user:your_password@localhost:5432/saudi_store"
```

---

## 4. إعداد ملف .env

افتح ملف `.env` وقم بتعديل القيم التالية:

### المتطلبات الأساسية:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-at-least-32-chars"
```

### توليد NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
# أو
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 5. تشغيل قاعدة البيانات

```bash
# إنشاء جداول قاعدة البيانات
npx prisma migrate dev --name init

# أو استخدام push مباشرة (للتطوير)
npx prisma db push

# إضافة البيانات الأولية (أدمن + تصنيفات + منتجات تجريبية)
npm run db:seed

# فتح واجهة إدارة قاعدة البيانات (اختياري)
npm run db:studio
```

---

## 6. تشغيل المشروع

```bash
# بيئة التطوير
npm run dev

# بناء الإنتاج
npm run build
npm start
```

افتح المتصفح على: http://localhost:3000

### بيانات الدخول الافتراضية:
- **البريد:** admin@saudistore.sa
- **كلمة المرور:** Admin@123456
- **لوحة التحكم:** http://localhost:3000/admin

---

## 7. ربط بوابة Moyasar (الأكثر شيوعاً في السعودية)

### خطوات التفعيل:

1. **إنشاء حساب:** https://moyasar.com
2. **الحصول على المفاتيح:**
   - اذهب إلى: Dashboard → Settings → API Keys
   - انسخ `Secret Key` و `Publishable Key`

3. **تحديث .env:**
```env
# بيئة الاختبار (Sandbox)
MOYASAR_SECRET_KEY="sk_test_xxxxxxxxxx"
MOYASAR_PUBLISHABLE_KEY="pk_test_xxxxxxxxxx"

# بيئة الإنتاج (بعد التفعيل من Moyasar)
# MOYASAR_SECRET_KEY="sk_live_xxxxxxxxxx"
# MOYASAR_PUBLISHABLE_KEY="pk_live_xxxxxxxxxx"
```

4. **اختبار عملية شراء:**
   - استخدم بطاقة الاختبار: `4111111111111111`
   - تاريخ الانتهاء: أي تاريخ مستقبلي
   - CVV: `123`

---

## 8. ربط Tap Payments

1. **إنشاء حساب:** https://tap.company
2. **الحصول على المفاتيح من:** Dashboard → Developers → API Keys

```env
TAP_SECRET_KEY="sk_test_xxxxxxxxxx"
TAP_PUBLISHABLE_KEY="pk_test_xxxxxxxxxx"
```

3. **بطاقة اختبار Tap:**
   - Visa: `4508750015741019`
   - CVV: `123` | انتهاء: `01/39`

---

## 9. ربط شركات الشحن

### Aramex:
1. سجّل على: https://www.aramex.com/developers
2. اطلب حساب تجريبي (Sandbox)
3. احصل على بيانات الحساب

```env
ARAMEX_USERNAME="your-username"
ARAMEX_PASSWORD="your-password"
ARAMEX_ACCOUNT_NUMBER="your-account"
ARAMEX_ACCOUNT_PIN="your-pin"
ARAMEX_ACCOUNT_ENTITY="AMM"
ARAMEX_ACCOUNT_COUNTRY_CODE="SA"
```

### SMSA Express:
1. تواصل مع: https://developer.smsa.com
2. احصل على API Key و Passkey

```env
SMSA_API_KEY="your-api-key"
SMSA_PASSKEY="your-passkey"
```

### البريد السعودي (واصل):
1. سجّل على: https://developer.spl.com.sa
2. احصل على بيانات الاعتماد

```env
SPL_API_KEY="your-api-key"
SPL_USERNAME="your-username"
SPL_PASSWORD="your-password"
```

---

## 10. الانتقال لبيئة الإنتاج

### قائمة التحقق قبل النشر:

```bash
# 1. تأكد من البناء بدون أخطاء
npm run build

# 2. تغيير جميع مفاتيح test إلى live في .env

# 3. تأكد من NEXTAUTH_URL
NEXTAUTH_URL="https://yourstore.com"

# 4. أنشئ migration للإنتاج
npx prisma migrate deploy
```

### النشر على Vercel (الأسهل):
```bash
npm install -g vercel
vercel --prod

# أضف متغيرات البيئة من Vercel Dashboard
```

---

## 11. هيكل الملفات

```
src/
├── app/
│   ├── (shop)/           # صفحات المتجر
│   │   ├── page.tsx      # الصفحة الرئيسية
│   │   ├── products/     # قائمة وتفاصيل المنتجات
│   │   ├── cart/         # سلة المشتريات
│   │   ├── checkout/     # إتمام الشراء
│   │   └── orders/       # طلبات المستخدم
│   ├── (auth)/           # صفحات المصادقة
│   │   ├── login/
│   │   └── register/
│   ├── admin/            # لوحة التحكم
│   │   ├── page.tsx      # الداشبورد
│   │   ├── products/     # إدارة المنتجات
│   │   ├── orders/       # إدارة الطلبات
│   │   └── ...
│   └── api/              # API Routes
│       ├── auth/
│       ├── orders/
│       ├── payments/
│       └── ...
├── components/
│   ├── layout/           # الهيدر والفوتر
│   ├── shop/             # مكونات المتجر
│   ├── checkout/         # مكونات الدفع
│   └── admin/            # مكونات الأدمن
├── lib/
│   ├── payments/         # تكامل بوابات الدفع
│   ├── shipping/         # تكامل شركات الشحن
│   ├── validations/      # Zod schemas
│   ├── auth.ts           # NextAuth config
│   └── prisma.ts         # Prisma client
├── store/                # Zustand state
└── types/                # TypeScript types
```

---

## 12. الأسئلة الشائعة

**كيف أضيف منتجاً جديداً؟**
اذهب لـ /admin/products ← "إضافة منتج"

**كيف أفعّل/أوقف منتج؟**
من قائمة المنتجات في الأدمن ← زر التعديل ← checkbox "المنتج نشط"

**كيف أتحقق من الدفعات؟**
اذهب لـ /admin/orders ← اختر الطلب ← ستجد حالة الدفع

**كيف أُنشئ كوبون خصم؟**
اذهب لـ /admin/coupons ← "إضافة كوبون"

---

## 13. دعم وتطوير

للإضافات والتخصيصات:
- Google Analytics: أضف في `layout.tsx`
- بريد إلكتروني: فعّل SMTP في `.env`
- رفع الصور السحابي: فعّل Cloudinary في `.env`
- تحليلات: أضف Vercel Analytics أو Hotjar
