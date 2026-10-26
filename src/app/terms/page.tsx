import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for purchasing furniture from CH Furniture House, Sialkot.",
  alternates: { canonical: `${SITE}/terms` },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <SiteShell>
      <div className="container-px py-16 md:py-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Terms & Conditions" },
          ]}
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-ink">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-inkMuted">Last updated: October 2025</p>

          <div className="prose prose-stone mt-10 max-w-none">
            <h2>1. About These Terms</h2>
            <p>
              These terms apply when you place an order with CH Furniture House (Chaudhry Furniture
              House), operating from Mohala Sardaaran, Near HBL Bank, Kalaswala, Pasrur, Sialkot,
              Punjab, Pakistan (&quot;we&quot;, &quot;us&quot;).
            </p>

            <h2>2. Orders &amp; Confirmation</h2>
            <p>
              All orders are confirmed via WhatsApp or email after discussion of specifications,
              dimensions, wood type, finish, and price. An order is only confirmed once a deposit
              has been received.
            </p>

            <h2>3. Pricing</h2>
            <p>
              All prices are quoted on request and are in Pakistani Rupees (PKR) unless otherwise
              agreed. Prices are valid for 14 days from the date of quotation. Quoted prices do not
              include delivery unless explicitly stated.
            </p>

            <h2>4. Payment</h2>
            <ul>
              <li>A deposit of 50% is required to commence production.</li>
              <li>The remaining balance is due before dispatch or on delivery.</li>
              <li>
                We accept cash, EasyPaisa, JazzCash, and direct bank transfer. Payment details are
                shared upon order confirmation.
              </li>
            </ul>

            <h2>5. Production &amp; Lead Times</h2>
            <p>
              Standard lead times are 4–8 weeks depending on the complexity of the piece. We will
              provide an estimated completion date at the time of order confirmation. Lead times are
              estimates and may vary due to material availability or finishing curing times.
            </p>

            <h2>6. Custom Orders</h2>
            <p>
              Custom and made-to-order pieces are non-cancellable once production has commenced. If
              you need to cancel before production starts, the deposit is non-refundable.
            </p>

            <h2>7. Warranty</h2>
            <p>
              We stand behind the quality of our work. Structural defects in joinery or finishing
              that appear within 12 months of delivery will be repaired free of charge. This does
              not cover normal wear, damage caused by misuse, or environmental factors such as
              extreme humidity or direct sunlight.
            </p>

            <h2>8. Website Content</h2>
            <p>
              Images on this website are representative. Actual colours and grain patterns in solid
              wood pieces will vary naturally. Product dimensions listed are approximate — final
              measurements are confirmed at the time of order.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These terms are governed by the laws of Pakistan. Any disputes shall be subject to
              the jurisdiction of the courts of Sialkot, Punjab, Pakistan.
            </p>

            <h2>10. Contact</h2>
            <p>
              Questions about these terms? Contact us at{" "}
              <a href="mailto:info@chfurniturehouse.com">info@chfurniturehouse.com</a> or WhatsApp
              +92 341 630 9652.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
