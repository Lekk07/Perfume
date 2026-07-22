"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { loadRazorpayScript } from "@/lib/razorpay";
import { formatPrice, cn } from "@/lib/utils";
import AddressSelector from "@/components/checkout/AddressSelector";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import CartSummary from "@/components/cart/CartSummary";
import type { PaymentMethod } from "@/types/order";

const SHIPPING_FEE = 79;
const FREE_SHIPPING_THRESHOLD = 1500;

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const discountPercent = useCartStore((s) => s.discountPercent);
  const couponCode = useCartStore((s) => s.couponCode);
  const clearCart = useCartStore((s) => s.clear);

  const user = useAuthStore((s) => s.currentUser());
  const placeOrder = useOrderStore((s) => s.placeOrder);

  const defaultAddress = user?.addresses.find((a) => a.isDefault) ?? user?.addresses[0] ?? null;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(defaultAddress?.id ?? null);
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discount = (subtotal * discountPercent) / 100;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  function validate(): string | null {
    if (lines.length === 0) return "Your cart is empty.";
    if (!selectedAddressId) return "Select or add a shipping address.";
    if (!email.trim()) return "Enter a contact email.";
    if (!phone.trim()) return "Enter a contact phone number.";
    return null;
  }

  function completeOrder(paymentStatus: "PAID" | "PENDING") {
    if (!user || !selectedAddressId) return;
    const address = user.addresses.find((a) => a.id === selectedAddressId);
    if (!address) return;

    const record = placeOrder({
      userId: user.id,
      items: lines.map((l) => ({
        productSlug: l.productSlug,
        name: l.name,
        brand: l.brand,
        image: l.image,
        sizeMl: l.sizeMl,
        price: l.price,
        quantity: l.quantity,
      })),
      address,
      email,
      phone,
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod,
      paymentStatus,
    });

    clearCart();
    router.push(`/checkout/confirmation?order=${record.orderNumber}`);
  }

  async function handlePlaceOrder() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setProcessing(true);

    if (paymentMethod === "COD") {
      completeOrder("PENDING");
      return;
    }

    // RAZORPAY
    if (razorpayKeyId) {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Couldn't load the payment gateway. Please try again.");
        setProcessing(false);
        return;
      }
      const rzp = new (window as any).Razorpay({
        key: razorpayKeyId,
        amount: Math.round(total * 100),
        currency: "INR",
        name: "Maison Voile",
        description: `Order for ${lines.length} item${lines.length !== 1 ? "s" : ""}`,
        prefill: { email, contact: phone, name: user?.name },
        theme: { color: "#C8A45D" },
        handler: () => completeOrder("PAID"),
        modal: { ondismiss: () => setProcessing(false) },
      });
      rzp.open();
    } else {
      // Demo mode — no live Razorpay key configured in this environment.
      setTimeout(() => completeOrder("PAID"), 900);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 pb-24 pt-40 text-center lg:px-10">
        <ShoppingBag size={40} strokeWidth={1} className="text-mist/40" />
        <h1 className="font-display text-3xl italic text-paper">Your cart is empty</h1>
        <p className="max-w-sm text-sm text-mist/60">Add something to your cart before checking out.</p>
        <Link href="/shop" className="btn-gold">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <div className="mb-10 text-center">
        <span className="eyebrow">last step</span>
        <h1 className="mt-3 text-4xl italic text-paper sm:text-5xl">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="mb-4 font-display text-xl text-paper">Shipping Address</h2>
            <AddressSelector selectedId={selectedAddressId} onSelect={setSelectedAddressId} />
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl text-paper">Contact Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-mist/40 focus:border-gold focus:outline-none"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl text-paper">Payment Method</h2>
            <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
            {paymentMethod === "RAZORPAY" && !razorpayKeyId && (
              <p className="mt-3 text-xs text-mist/50">
                Demo mode — no live Razorpay key is configured in this environment, so
                payment will be simulated. Add your key to{" "}
                <code className="text-gold/80">NEXT_PUBLIC_RAZORPAY_KEY_ID</code> to enable
                the real checkout widget.
              </p>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <CartSummary showCheckoutButton={false} />
          {couponCode && (
            <p className="text-center text-xs text-gold">Coupon {couponCode} applied</p>
          )}
          {error && <p className="text-center text-xs text-red-400">{error}</p>}
          <button
            onClick={handlePlaceOrder}
            disabled={processing}
            className={cn("btn-gold w-full", processing && "cursor-not-allowed opacity-60")}
          >
            {processing
              ? "Processing…"
              : `Place Order · ${formatPrice(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
