import type { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";
import AccountLayout from "@/components/account/AccountLayout";
import OrderHistoryList from "@/components/account/OrderHistoryList";

export const metadata: Metadata = { title: "Order History" };

export default function OrdersPage() {
  return (
    <AuthGuard>
      <AccountLayout>
        <h2 className="mb-6 font-display text-xl text-paper">Order History</h2>
        <OrderHistoryList />
      </AccountLayout>
    </AuthGuard>
  );
}
