export default function PolicyLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-10">
      <div className="mb-14 flex flex-col items-center text-center">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-3 text-4xl italic text-paper sm:text-5xl">{title}</h1>
        <p className="mt-3 text-xs text-mist/50">Last updated {updated}</p>
      </div>
      <div className="flex flex-col gap-6 text-sm leading-relaxed text-mist/80 [&_h2]:mt-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:italic [&_h2]:text-paper [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
        {children}
      </div>
    </div>
  );
}
