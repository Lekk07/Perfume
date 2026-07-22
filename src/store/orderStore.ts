"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderRecord, OrderStatus } from "@/types/order";

interface OrderState {
  orders: OrderRecord[];
  placeOrder: (order: Omit<OrderRecord, "id" | "orderNumber" | "createdAt" | "status">) => OrderRecord;
  getOrdersForUser: (userId: string) => OrderRecord[];
  getOrderByNumber: (orderNumber: string) => OrderRecord | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

function generateOrderNumber(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `MV${random}`;
}

// Orders placed at checkout are stored here for now. This becomes a real
// POST /api/orders (writing to the Order/OrderItem/Payment Prisma models)
// once the backend module is wired — placeOrder's return shape already
// matches what that API would send back.
export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      placeOrder: (order) => {
        const record: OrderRecord = {
          ...order,
          id: `o_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          orderNumber: generateOrderNumber(),
          status: "CONFIRMED",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [record, ...state.orders] }));
        return record;
      },

      getOrdersForUser: (userId) => get().orders.filter((o) => o.userId === userId),

      getOrderByNumber: (orderNumber) => get().orders.find((o) => o.orderNumber === orderNumber),

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }));
      },
    }),
    { name: "lumiere-orders" }
  )
);
