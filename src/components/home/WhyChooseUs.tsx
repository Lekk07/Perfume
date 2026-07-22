import { PackageCheck, ShieldCheck, Sparkles, Truck } from "lucide-react";

const POINTS = [
  {
    icon: Sparkles,
    title: "100% Authentic",
    body: "Every decant is drawn from an authentic, sealed bottle sourced directly from authorized retailers.",
  },
  {
    icon: PackageCheck,
    title: "Leak-Proof Vials",
    body: "Travel-safe glass atomizers, sealed and boxed to arrive exactly as filled.",
  },
  {
    icon: Truck,
    title: "48-Hour Dispatch",
    body: "Orders placed before 3pm are decanted and shipped the same or next business day.",
  },
  {
    icon: ShieldCheck,
    title: "Try Before You Commit",
    body: "Test a fragrance on your skin for weeks before investing in a full bottle.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="border-y border-black/[0.06] bg-ink-raised/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-24 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex flex-col items-start gap-4">
            <div className="rounded-full border border-gold/30 p-3 text-gold">
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-xl text-paper">{title}</h3>
            <p className="text-sm leading-relaxed text-mist/70">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
