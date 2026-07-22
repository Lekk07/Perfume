"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormValues } from "@/lib/validation";
import FormField, { inputClass } from "@/components/auth/FormField";
import type { Address } from "@/types/auth";

export default function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Address;
  onSave: (data: AddressFormValues) => void | Promise<void>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: initial ?? { country: "India", isDefault: false },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="glass-panel flex flex-col gap-4 rounded-2xl p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Full Name" error={errors.fullName?.message}>
          <input type="text" className={inputClass} {...register("fullName")} />
        </FormField>
        <FormField label="Phone" error={errors.phone?.message}>
          <input type="tel" className={inputClass} {...register("phone")} />
        </FormField>
      </div>
      <FormField label="Address Line 1" error={errors.line1?.message}>
        <input type="text" className={inputClass} {...register("line1")} />
      </FormField>
      <FormField label="Address Line 2 (optional)" error={errors.line2?.message}>
        <input type="text" className={inputClass} {...register("line2")} />
      </FormField>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="City" error={errors.city?.message}>
          <input type="text" className={inputClass} {...register("city")} />
        </FormField>
        <FormField label="State" error={errors.state?.message}>
          <input type="text" className={inputClass} {...register("state")} />
        </FormField>
        <FormField label="Postal Code" error={errors.postalCode?.message}>
          <input type="text" className={inputClass} {...register("postalCode")} />
        </FormField>
      </div>
      <FormField label="Country" error={errors.country?.message}>
        <input type="text" className={inputClass} {...register("country")} />
      </FormField>

      <label className="flex items-center gap-2 text-sm text-mist/80">
        <input type="checkbox" className="h-4 w-4 accent-gold" {...register("isDefault")} />
        Set as default address
      </label>

      <div className="flex gap-3">
        <button type="submit" disabled={isSubmitting} className="btn-gold">
          Save Address
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}
