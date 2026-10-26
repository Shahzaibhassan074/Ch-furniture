import { Sidebar } from "@/components/admin/Sidebar";

// Auth is enforced by middleware — no need to re-verify session here.
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-8">{children}</div>
      </div>
    </div>
  );
}
