import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product Not Found",
  robots: { index: false, follow: false },
};

export default function ProductNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow justify-center">Error 404</p>
      <h1 className="mt-5 font-display text-6xl font-medium text-ink">Product not found</h1>
      <p className="mt-4 max-w-md text-inkMuted">
        This product has been removed or never existed. Browse our collections to find what you need.
      </p>
      <Link href="/categories" className="btn-terra mt-8">Browse Collections</Link>
    </div>
  );
}
