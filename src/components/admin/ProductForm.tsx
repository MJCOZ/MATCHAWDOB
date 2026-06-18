"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/lib/validations";
import { Loader2, Upload, X, ImagePlus } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { slugify } from "@/lib/utils";

interface ProductFormProps {
  categories: { id: string; nameAr: string; slug: string }[];
  initialData?: any;
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [mainImage, setMainImage] = useState<string>(initialData?.mainImage || "");
  const [uploadingImage, setUploadingImage] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameAr: initialData?.nameAr || "",
      nameEn: initialData?.nameEn || "",
      descriptionAr: initialData?.descriptionAr || "",
      price: initialData?.price || undefined,
      salePrice: initialData?.salePrice || undefined,
      stock: initialData?.stock || 0,
      categoryId: initialData?.categoryId || "",
      sku: initialData?.sku || "",
      weight: initialData?.weight || undefined,
      isFeatured: initialData?.isFeatured || false,
      isActive: initialData?.isActive !== false,
      isNew: initialData?.isNew || false,
    },
  });

  const nameAr = watch("nameAr");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingImage(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (data.url) {
          setImages((prev) => [...prev, data.url]);
          if (!mainImage) setMainImage(data.url);
        }
      }
    } catch {
      toast.error("فشل رفع الصورة");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((i) => i !== url));
    if (mainImage === url) setMainImage(images.find((i) => i !== url) || "");
  };

  const onSubmit = async (data: ProductInput) => {
    setIsLoading(true);
    try {
      const slug = slugify(nameAr);
      const payload = { ...data, slug, images, mainImage };

      const res = await fetch(
        isEdit ? `/api/admin/products/${initialData.id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "حدث خطأ");

      toast.success(isEdit ? "تم تحديث المنتج" : "تم إضافة المنتج بنجاح");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* المعلومات الأساسية */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">المعلومات الأساسية</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">اسم المنتج بالعربية *</label>
            <input type="text" {...register("nameAr")} className="input-field" placeholder="مثال: سماعات بلوتوث لاسلكية" />
            {errors.nameAr && <p className="text-red-500 text-xs mt-1">{errors.nameAr.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">اسم المنتج بالإنجليزية</label>
            <input type="text" {...register("nameEn")} className="input-field" placeholder="Wireless Bluetooth Headphones" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">الوصف بالعربية</label>
            <textarea {...register("descriptionAr")} rows={4} className="input-field resize-none" placeholder="وصف تفصيلي للمنتج..." />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">التصنيف *</label>
            <select {...register("categoryId")} className="input-field">
              <option value="">اختر تصنيفاً</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameAr}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">رمز المنتج SKU</label>
            <input type="text" {...register("sku")} className="input-field" placeholder="PROD-001" />
          </div>
        </div>
      </div>

      {/* التسعير والمخزون */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">التسعير والمخزون</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">السعر الأصلي *</label>
            <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className="input-field" placeholder="0.00" />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">سعر الخصم (اختياري)</label>
            <input type="number" step="0.01" {...register("salePrice", { setValueAs: (v) => v === "" ? null : Number(v) })} className="input-field" placeholder="اتركه فارغاً إن لم يوجد خصم" />
            <p className="text-xs text-gray-400 mt-1">اتركه فارغاً إن لم يوجد خصم — لا تكتب 0.</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">المخزون *</label>
            <input type="number" {...register("stock", { valueAsNumber: true })} className="input-field" placeholder="0" />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">الوزن (كجم) (اختياري)</label>
            <input type="number" step="0.001" {...register("weight", { setValueAs: (v) => v === "" ? null : Number(v) })} className="input-field" placeholder="اتركه فارغاً إن لم تحتاجه" />
          </div>
        </div>
      </div>

      {/* الصور */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">صور المنتج</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
          {images.map((url) => (
            <div key={url} className="relative aspect-square">
              <Image src={url} alt="صورة المنتج" fill className="object-cover rounded-xl" />
              {url === mainImage && (
                <div className="absolute bottom-1 right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded">رئيسية</div>
              )}
              <button type="button" onClick={() => removeImage(url)} className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                <X size={12} />
              </button>
              {url !== mainImage && (
                <button type="button" onClick={() => setMainImage(url)} className="absolute bottom-1 left-1 bg-white/90 text-xs px-1.5 py-0.5 rounded text-gray-600 hover:bg-orange-100">
                  تعيين رئيسية
                </button>
              )}
            </div>
          ))}
          <label className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${uploadingImage ? "opacity-50" : "hover:border-orange-400 hover:bg-orange-50/30 border-gray-300"}`}>
            {uploadingImage ? <Loader2 size={24} className="animate-spin text-orange-500" /> : <><ImagePlus size={24} className="text-gray-400 mb-1" /><span className="text-xs text-gray-500">رفع صورة</span></>}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
          </label>
        </div>
        <p className="text-xs text-gray-500">يدعم: JPG, PNG, WebP. الحجم الأقصى: 5MB. انقر على صورة لتعيينها كالصورة الرئيسية.</p>
      </div>

      {/* الخيارات */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">الخيارات والحالة</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "isActive" as const, label: "المنتج نشط ومرئي", desc: "يظهر في المتجر" },
            { name: "isFeatured" as const, label: "منتج مميز ⭐", desc: "يظهر في الصفحة الرئيسية" },
            { name: "isNew" as const, label: "منتج جديد ✨", desc: "يظهر في قسم الجديد" },
          ].map(({ name, label, desc }) => (
            <label key={name} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" {...register(name)} className="accent-orange-500 w-4 h-4 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* أزرار الحفظ */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <><Loader2 size={18} className="animate-spin" />جاري الحفظ...</> : isEdit ? "حفظ التغييرات" : "إضافة المنتج"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="btn-outline py-3.5 px-8">
          إلغاء
        </button>
      </div>
    </form>
  );
}
