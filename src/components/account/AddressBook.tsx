"use client";

import { useState } from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import AddressForm from "@/components/account/AddressForm";

export default function AddressBook() {
  const user = useAuthStore((s) => s.currentUser());
  const addAddress = useAuthStore((s) => s.addAddress);
  const updateAddress = useAuthStore((s) => s.updateAddress);
  const removeAddress = useAuthStore((s) => s.removeAddress);

  const [mode, setMode] = useState<"list" | "add" | { edit: string }>("list");
  const addresses = user?.addresses ?? [];

  if (mode === "add") {
    return (
      <AddressForm
        onSave={async (data) => {
          await addAddress(data);
          setMode("list");
        }}
        onCancel={() => setMode("list")}
      />
    );
  }

  if (typeof mode === "object") {
    const existing = addresses.find((a) => a.id === mode.edit);
    return (
      <AddressForm
        initial={existing}
        onSave={async (data) => {
          await updateAddress(mode.edit, data);
          setMode("list");
        }}
        onCancel={() => setMode("list")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-paper">Saved Addresses</h2>
        <button
          onClick={() => setMode("add")}
          className="flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-xs uppercase tracking-label text-paper hover:border-gold/50 hover:text-gold"
        >
          <Plus size={13} /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="glass-panel flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
          <MapPin size={28} strokeWidth={1} className="text-mist/40" />
          <p className="text-sm text-mist/60">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="glass-panel flex flex-col gap-2 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <p className="font-display text-base text-paper">{address.fullName}</p>
                {address.isDefault && (
                  <span className="rounded-full border border-gold/30 px-2.5 py-0.5 text-[10px] uppercase tracking-label text-gold">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-mist/70">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
              </p>
              <p className="text-sm text-mist/70">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-sm text-mist/70">{address.country}</p>
              <p className="text-xs text-mist/50">{address.phone}</p>

              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setMode({ edit: address.id })}
                  className="flex items-center gap-1 text-xs text-mist/60 hover:text-gold"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => removeAddress(address.id)}
                  className="flex items-center gap-1 text-xs text-mist/60 hover:text-red-400"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
