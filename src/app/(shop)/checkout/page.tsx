import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "إتمام الشراء" };

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const userId = (session.user as any).id;

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="container-custom py-8 max-w-5xl">
      <h1 className="text-2xl font-black text-gray-900 mb-8">إتمام الشراء</h1>
      <CheckoutForm addresses={addresses as any} userId={userId} />
    </div>
  );
}
