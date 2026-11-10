import Link from "next/link";
import { MobileGenericShell } from "@/components/mobile/MobileGenericShell";

export default function NotFound() {
  return (
    <>
      {/* desktop */}
      <div className="hidden md:contents">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow justify-center">Error 404</p>
          <h1 className="mt-5 font-display text-6xl font-medium text-linen">Page not found</h1>
          <p className="mt-4 max-w-md text-linenDim">
            The page you're looking for has moved or no longer exists. Let's get you back to the collections.
          </p>
          <Link href="/" className="btn-brass mt-8">Back to Home</Link>
        </div>
      </div>
      {/* mobile */}
      <div className="md:hidden">
        <MobileGenericShell>
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#A64A25",
                margin: "0 0 12px",
              }}
            >
              Error 404
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-m-display,"Playfair Display",serif)',
                fontSize: "36px",
                fontWeight: 600,
                color: "#1A1A1A",
                margin: "0 0 12px",
                lineHeight: 1.2,
              }}
            >
              Page not found
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#5F5A54",
                margin: "0 0 28px",
                lineHeight: 1.6,
                maxWidth: "280px",
              }}
            >
              The page you&apos;re looking for has moved or no longer exists.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#23402F",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 600,
                padding: "13px 28px",
                borderRadius: "25px",
                textDecoration: "none",
              }}
            >
              Back to Home
            </Link>
          </div>
        </MobileGenericShell>
      </div>
    </>
  );
}
