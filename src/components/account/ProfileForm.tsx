"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { profileSchema, type ProfileFormValues } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";
import FormField, { inputClass } from "@/components/auth/FormField";

export default function ProfileForm() {
  const user = useAuthStore((s) => s.currentUser());
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setError(null);
    const result = await updateProfile(data);
    if (!result.success) {
      setError(result.message ?? "Couldn't save changes.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel flex flex-col gap-5 rounded-2xl p-7">
      <h2 className="font-display text-xl text-paper">Profile Information</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Full Name" error={errors.name?.message}>
          <input type="text" className={inputClass} {...register("name")} />
        </FormField>
        <FormField label="Email" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register("email")} />
        </FormField>
      </div>

      <FormField label="Phone (optional)" error={errors.phone?.message}>
        <input type="tel" placeholder="+91 98765 43210" className={inputClass} {...register("phone")} />
      </FormField>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button type="submit" disabled={isSubmitting} className="btn-gold self-start">
        {saved ? (
          <>
            <Check size={16} /> Saved
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}
