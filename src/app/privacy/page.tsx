import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://chfurniturehouse.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for CH Furniture House — how we collect, use, and protect your information.",
  alternates: { canonical: `${SITE}/privacy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <div className="container-px py-16 md:py-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy" },
          ]}
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-ink">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-inkMuted">Last updated: October 2025</p>

          <div className="prose prose-stone mt-10 max-w-none">
            <h2>1. Who We Are</h2>
            <p>
              CH Furniture House (trading name of Chaudhry Furniture House) is a furniture
              manufacturer based at Mohala Sardaaran, Near HBL Bank, Kalaswala, Pasrur, Sialkot,
              Punjab, Pakistan. We operate the website chfurniturehouse.com.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We collect information you provide directly to us:</p>
            <ul>
              <li>
                <strong>Contact form:</strong> name, email address (optional), phone number
                (optional), and your message.
              </li>
              <li>
                <strong>WhatsApp enquiries:</strong> your WhatsApp display name and the messages you
                send us. WhatsApp&apos;s own privacy policy applies to those communications.
              </li>
            </ul>
            <p>
              We do not collect payment card details — all payment arrangements are made directly
              between buyer and seller offline.
            </p>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information you provide solely to:</p>
            <ul>
              <li>Respond to your enquiry or quote request.</li>
              <li>Coordinate delivery or order details.</li>
              <li>Send a single follow-up if we have not heard back (no unsolicited marketing).</li>
            </ul>

            <h2>4. Sharing Your Information</h2>
            <p>
              We do not sell, rent, or share your personal information with third parties except as
              necessary to deliver your order (e.g., a logistics provider) or as required by
              Pakistani law.
            </p>

            <h2>5. Cookies &amp; Analytics</h2>
            <p>
              Our website may use standard session cookies for basic functionality. We do not
              currently use third-party advertising or tracking cookies. If we add analytics in
              future, this policy will be updated.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              Contact form submissions are retained for up to 12 months and then deleted. You may
              request deletion at any time by contacting us.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of any personal information we
              hold about you by emailing{" "}
              <a href="mailto:info@chfurniturehouse.com">info@chfurniturehouse.com</a> or messaging
              us on WhatsApp at +92 341 630 9652.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be noted with an
              updated date at the top of this page.
            </p>

            <h2>9. Contact</h2>
            <p>
              For any privacy questions, contact us at{" "}
              <a href="mailto:info@chfurniturehouse.com">info@chfurniturehouse.com</a> or via
              WhatsApp at +92 341 630 9652.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
