"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";
import FormField, { inputClass } from "@/components/auth/FormField";

export default function ForgotPasswordForm() {
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: ForgotPasswordFormValues) {
    await requestPasswordReset(data.email);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <Check size={28} className="text-gold" />
        <p className="font-display text-lg text-paper">Check your email</p>
        <p className="text-sm text-mist/60">
          If an account exists for that email, we've sent a link to reset your password.
        </p>
        <Link href="/login" className="mt-2 text-sm text-gold hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormField label="Email" error={errors.email?.message}>
        <input type="email" placeholder="you@example.com" className={inputClass} {...register("email")} />
      </FormField>

      <button type="submit" disabled={isSubmitting} className="btn-gold mt-2 w-full">
        {isSubmitting ? "Sending…" : "Send Reset Link"}
      </button>

      <p className="text-center text-sm text-mist/60">
        Remembered it after all?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
