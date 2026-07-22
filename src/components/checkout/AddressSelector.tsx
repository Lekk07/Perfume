"use client";

import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import AddressForm from "@/components/account/AddressForm";
import type { Address } from "@/types/auth";

export default function AddressSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const user = useAuthStore((s) => s.currentUser());
  const addAddress = useAuthStore((s) => s.addAddress);
  const [addingNew, setAddingNew] = useState(false);

  const addresses = user?.addresses ?? [];

  if (addingNew) {
    return (
      <AddressForm
        onSave={async (data) => {
          await addAddress(data);
          setAddingNew(false);
        }}
        onCancel={() => setAddingNew(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.length === 0 ? (
        <div className="glass-panel flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
          <MapPin size={26} strokeWidth={1} className="text-mist/40" />
          <p className="text-sm text-mist/60">No saved addresses yet — add one to continue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {addresses.map((address: Address) => {
            const selected = address.id === selectedId;
            return (
              <button
                key={address.id}
                type="button"
                onClick={() => onSelect(address.id)}
                className={cn(
                  "flex flex-col gap-1 rounded-2xl border p-5 text-left transition-colors",
                  selected ? "border-gold bg-gold/[0.06]" : "border-black/10 hover:border-black/25"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-base text-paper">{address.fullName}</p>
                  {address.isDefault && (
                    <span className="rounded-full border border-gold/30 px-2 py-0.5 text-[9px] uppercase tracking-label text-gold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-mist/70">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>
                <p className="text-xs text-mist/70">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-xs text-mist/50">{address.phone}</p>
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setAddingNew(true)}
        className="flex items-center gap-1.5 self-start rounded-full border border-black/15 px-4 py-2 text-xs uppercase tracking-label text-paper hover:border-gold/50 hover:text-gold"
      >
        <Plus size={13} /> Add New Address
      </button>
    </div>
  );
}
