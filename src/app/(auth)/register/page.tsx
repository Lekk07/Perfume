import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="join the atelier"
      title="Create Your Account"
      subtitle="Save addresses, track orders, and build your wishlist."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
