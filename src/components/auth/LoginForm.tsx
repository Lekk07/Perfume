"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";
import FormField, { inputClass } from "@/components/auth/FormField";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFormValues) {
    setFormError(null);
    const result = await login(data.email, data.password);
    if (!result.success) {
      setFormError(result.message ?? "Something went wrong. Please try again.");
      return;
    }
    const redirect = searchParams.get("redirect");
    router.push(redirect && redirect.startsWith("/") ? redirect : "/profile");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormField label="Email" error={errors.email?.message}>
        <input type="email" placeholder="you@example.com" className={inputClass} {...register("email")} />
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
        <input type="password" placeholder="Your password" className={inputClass} {...register("password")} />
      </FormField>

      <div className="-mt-2 text-right">
        <Link href="/forgot-password" className="text-xs text-mist/60 hover:text-gold">
          Forgot password?
        </Link>
      </div>

      {formError && <p className="text-xs text-red-400">{formError}</p>}

      <button type="submit" disabled={isSubmitting} className="btn-gold mt-2 w-full">
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-sm text-mist/60">
        New to Maison Voile?{" "}
        <Link href="/register" className="text-gold hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
