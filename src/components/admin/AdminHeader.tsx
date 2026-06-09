"use client";
import { signOut } from "next-auth/react";
import { Bell, LogOut, User } from "lucide-react";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div></div>
      <div className="flex items-center gap-3">
        {/* الإشعارات */}
        <button className="relative p-2 hover:bg-[#eeedf8] rounded-xl transition-colors">
          <Bell size={20} className="text-[#261B6D]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* المستخدم */}
        <div className="flex items-center gap-3 bg-[#eeedf8] rounded-xl px-3 py-2">
          <div className="w-8 h-8 bg-[#261B6D] rounded-full flex items-center justify-center text-[#B2DE81] text-sm font-bold">
            {user.name?.[0] || "م"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">مدير النظام</p>
          </div>
        </div>

        {/* تسجيل الخروج */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-2 hover:bg-red-50 rounded-xl transition-colors text-[#261B6D]/50 hover:text-red-500"
          title="تسجيل الخروج"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
