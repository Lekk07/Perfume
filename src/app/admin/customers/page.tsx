"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  addressCount: number;
  orderCount: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminUserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Failed to load");
        return res.json();
      })
      .then((data) => setCustomers(data.users))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <span className="eyebrow">people</span>
        <h1 className="mt-3 text-3xl italic text-paper">Customers</h1>
      </div>

      {error && (
        <div className="glass-panel rounded-2xl p-8 text-center text-sm text-red-400">{error}</div>
      )}

      {!error && customers === null && (
        <div className="glass-panel rounded-2xl p-8 text-center text-sm text-mist/60">Loading…</div>
      )}

      {!error && customers?.length === 0 && (
        <div className="glass-panel flex flex-col items-center gap-3 rounded-2xl p-12 text-center">
          <p className="text-sm text-mist/60">No customers have registered yet.</p>
        </div>
      )}

      {!error && customers && customers.length > 0 && (
        <div className="glass-panel overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-xs uppercase tracking-label text-mist/50">
                <th className="px-6 py-4">Name</th>
                <th className="hidden px-6 py-4 sm:table-cell">Email</th>
                <th className="hidden px-6 py-4 sm:table-cell">Addresses</th>
                <th className="px-6 py-4 text-right">Orders</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((user) => (
                <tr key={user.id} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-display text-base text-paper">{user.name}</p>
                    <p className="text-xs text-mist/50 sm:hidden">{user.email}</p>
                  </td>
                  <td className="hidden px-6 py-4 text-mist/70 sm:table-cell">{user.email}</td>
                  <td className="hidden px-6 py-4 text-mist/70 sm:table-cell">{user.addressCount}</td>
                  <td className="px-6 py-4 text-right text-gold">{user.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
