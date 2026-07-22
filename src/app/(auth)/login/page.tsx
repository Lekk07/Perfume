import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="welcome back"
      title="Sign In"
      subtitle="Access your orders, wishlist, and saved addresses."
    >
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
