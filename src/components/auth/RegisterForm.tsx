"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";
import FormField, { inputClass } from "@/components/auth/FormField";

export default function RegisterForm() {
  const router = useRouter();
  const register_ = useAuthStore((s) => s.register);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterFormValues) {
    setFormError(null);
    const result = await register_(data.name, data.email, data.password);
    if (!result.success) {
      setFormError(result.message ?? "Something went wrong. Please try again.");
      return;
    }
    router.push("/profile");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormField label="Full Name" error={errors.name?.message}>
        <input type="text" placeholder="Your name" className={inputClass} {...register("name")} />
      </FormField>

      <FormField label="Email" error={errors.email?.message}>
        <input type="email" placeholder="you@example.com" className={inputClass} {...register("email")} />
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
        <input type="password" placeholder="At least 8 characters" className={inputClass} {...register("password")} />
      </FormField>

      <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
        <input type="password" placeholder="Re-enter password" className={inputClass} {...register("confirmPassword")} />
      </FormField>

      {formError && <p className="text-xs text-red-400">{formError}</p>}

      <button type="submit" disabled={isSubmitting} className="btn-gold mt-2 w-full">
        {isSubmitting ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-center text-sm text-mist/60">
        Already have an account?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
