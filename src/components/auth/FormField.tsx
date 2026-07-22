import { cn } from "@/lib/utils";

export default function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-label text-mist/70">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export const inputClass = cn(
  "w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper",
  "placeholder:text-mist/40 focus:border-gold focus:outline-none"
);
