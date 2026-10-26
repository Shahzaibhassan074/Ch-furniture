import { Providers } from "@/components/admin/Providers";

// Admin section uses a noindex robots directive.
export const metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {children}
    </Providers>
  );
}
