"use client";
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function DeleteCategoryButton({ categoryId, categoryName, productCount }: { categoryId: string; categoryName: string; productCount: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const warning = productCount > 0
      ? `يحتوي "${categoryName}" على ${productCount} منتج، ولا يمكن حذفه قبل نقل أو حذف منتجاته. هل تريد المحاولة رغم ذلك؟`
      : `هل أنت متأكد من حذف "${categoryName}"؟ لا يمكن التراجع عن هذا الإجراء.`;
    if (!confirm(warning)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الحذف");
      toast.success("تم حذف التصنيف");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-500 disabled:opacity-50"
      title="حذف"
      aria-label={`حذف ${categoryName}`}
    >
      {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  );
}
