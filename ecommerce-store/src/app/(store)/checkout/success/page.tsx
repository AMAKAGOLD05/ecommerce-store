import Link from "next/link";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Thank you</p>
      <h1 className="mt-3 font-serif text-5xl">Order received</h1>
      <p className="mt-4 text-[#5d5348]">
        {order
          ? `Your order ${order} is being packed in Lagos. Pay on delivery when it arrives.`
          : "Your order is being packed in Lagos. Pay on delivery when it arrives."}
      </p>
      <Link href="/shop" className="mt-8 inline-flex rounded-full bg-[#1c1915] px-6 py-3 text-sm text-white">
        Continue shopping
      </Link>
    </div>
  );
}
