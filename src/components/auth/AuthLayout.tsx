import ScentTrail from "@/components/home/ScentTrail";

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto flex min-h-[85vh] max-w-md flex-col items-center justify-center overflow-hidden px-6 py-24">
      <ScentTrail className="left-1/2 top-0 h-[180px] w-[160%] -translate-x-1/2 opacity-40" />
      <div className="relative mb-8 flex flex-col items-center text-center">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-3 text-3xl italic text-paper sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-mist/60">{subtitle}</p>
      </div>
      <div className="glass-panel relative w-full rounded-2xl p-8">{children}</div>
    </div>
  );
}
