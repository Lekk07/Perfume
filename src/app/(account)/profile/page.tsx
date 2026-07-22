import type { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";
import AccountLayout from "@/components/account/AccountLayout";
import ProfileForm from "@/components/account/ProfileForm";
import AddressBook from "@/components/account/AddressBook";

export const metadata: Metadata = { title: "Your Profile" };

export default function ProfilePage() {
  return (
    <AuthGuard>
      <AccountLayout>
        <div className="flex flex-col gap-10">
          <ProfileForm />
          <AddressBook />
        </div>
      </AccountLayout>
    </AuthGuard>
  );
}
