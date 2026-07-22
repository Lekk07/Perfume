import Link from "next/link";
import ScentTrail from "@/components/home/ScentTrail";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <ScentTrail className="left-1/2 top-1/3 h-[200px] w-[150%] -translate-x-1/2 opacity-50" />
      <span className="eyebrow relative">lost your way?</span>
      <h1 className="relative mt-4 font-display text-8xl italic text-gold">404</h1>
      <p className="relative mt-4 max-w-sm text-sm text-mist/70">
        This scent has evaporated. The page you're looking for doesn't exist or may have moved.
      </p>
      <Link href="/" className="btn-gold relative mt-8">
        Back to Home
      </Link>
    </div>
  );
}
