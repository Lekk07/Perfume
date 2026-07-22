"use client";

import { CreditCard, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types/order";

export default function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}) {
  const options: { id: PaymentMethod; label: string; description: string; icon: typeof CreditCard }[] = [
    {
      id: "RAZORPAY",
      label: "Pay Online",
      description: "Card, UPI, netbanking via Razorpay",
      icon: CreditCard,
    },
    {
      id: "COD",
      label: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: Truck,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map(({ id, label, description, icon: Icon }) => {
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex items-start gap-3 rounded-2xl border p-5 text-left transition-colors",
              selected ? "border-gold bg-gold/[0.06]" : "border-black/10 hover:border-black/25"
            )}
          >
            <div className={cn("rounded-full border p-2", selected ? "border-gold text-gold" : "border-black/20 text-mist/60")}>
              <Icon size={16} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-display text-base text-paper">{label}</p>
              <p className="text-xs text-mist/60">{description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
