"use client";
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`هل أنت متأكد من حذف "${productName}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل الحذف");
      toast.success("تم حذف المنتج");
      router.refresh();
    } catch {
      toast.error("حدث خطأ في حذف المنتج");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-500 disabled:opacity-50"
      title="حذف"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
