import type { Address } from "@/types/auth";

export interface OrderLine {
  productSlug: string;
  name: string;
  brand: string;
  image: string;
  sizeMl: number;
  price: number;
  quantity: number;
}

export type OrderStatus = "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED";
export type PaymentMethod = "RAZORPAY" | "COD";
export type PaymentStatus = "PAID" | "PENDING";

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderLine[];
  address: Address;
  email: string;
  phone: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
}
