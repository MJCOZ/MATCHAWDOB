import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  // حماية لوحة التحكم - فقط للمدراء
  if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
