import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";

export const metadata: Metadata = {
  title: "Delivery & Returns",
  description:
    "Delivery options and returns policy for CH Furniture House — furniture delivery across Pakistan and exports.",
  alternates: { canonical: `${SITE}/delivery` },
  robots: { index: true, follow: true },
};

export default function DeliveryPage() {
  return (
    <SiteShell>
      <div className="container-px py-16 md:py-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Delivery & Returns" },
          ]}
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-ink">
            Delivery &amp; Returns
          </h1>
          <p className="mt-3 text-sm text-inkMuted">Last updated: October 2025</p>

          <div className="prose prose-stone mt-10 max-w-none">
            <h2>Workshop Pickup</h2>
            <p>
              You are welcome to collect your order directly from our workshop in Mohala Sardaaran,
              Near HBL Bank, Kalaswala, Pasrur, Sialkot, Punjab, Pakistan. We recommend arranging a
              visit time in advance via WhatsApp.
            </p>

            <h2>Delivery Within Pakistan</h2>
            <p>
              We deliver across Pakistan using trusted logistics partners. Delivery charges depend
              on the size and weight of the furniture, destination city, and carrier rates at the
              time of dispatch. Delivery costs are quoted separately and confirmed before production
              begins.
            </p>
            <ul>
              <li>
                <strong>Sialkot &amp; nearby districts:</strong> direct delivery can usually be
                arranged by our own team.
              </li>
              <li>
                <strong>Major cities (Lahore, Islamabad, Karachi, Faisalabad, etc.):</strong>{" "}
                shipped via freight carrier. Typical transit time is 2–5 business days after
                dispatch.
              </li>
              <li>
                <strong>Remote areas:</strong> please enquire — delivery may take longer or require
                collection from the nearest city depot.
              </li>
            </ul>
            <p>
              All furniture is carefully wrapped and padded for transit. For large pieces we use
              professional packing crates where needed.
            </p>

            <h2>International &amp; Export Orders</h2>
            <p>
              We arrange export for international buyers. Customs, import duties, and taxes are the
              buyer&apos;s responsibility. Please contact us on WhatsApp before placing an
              international order to discuss logistics and documentation.
            </p>

            <h2>Inspection on Delivery</h2>
            <p>
              Please inspect your furniture thoroughly upon delivery. Any transit damage must be
              reported to us within 48 hours of receipt with photographs. We will arrange repair or
              replacement at our cost.
            </p>

            <h2>Returns &amp; Cancellations</h2>
            <p>
              Because almost all our pieces are made to order, we are unable to accept returns for
              change of mind. However:
            </p>
            <ul>
              <li>
                <strong>Defects:</strong> if a piece has a structural or finishing defect, we will
                repair or replace it — see the Warranty clause in our{" "}
                <a href="/terms">Terms &amp; Conditions</a>.
              </li>
              <li>
                <strong>Wrong specifications:</strong> if we manufacture a piece to the wrong
                agreed dimensions or finish, we will correct it at no charge.
              </li>
              <li>
                <strong>Cancellation before production starts:</strong> the deposit is
                non-refundable. Cancellation after production has started is not possible.
              </li>
            </ul>

            <h2>Questions?</h2>
            <p>
              For any delivery or returns enquiries, message us on WhatsApp at +92 341 630 9652 or
              email{" "}
              <a href="mailto:info@chfurniturehouse.com">info@chfurniturehouse.com</a>.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
