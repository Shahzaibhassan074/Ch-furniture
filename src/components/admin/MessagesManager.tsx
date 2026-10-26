"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, Phone } from "lucide-react";
import { markMessageRead, deleteMessage } from "@/app/actions/admin";

type Message = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
};

export function MessagesManager({ messages }: { messages: Message[] }) {
  return (
    <div>
      <div>
        <p className="text-[11px] font-sans font-medium uppercase tracking-widest text-inkMuted">Inbox</p>
        <h1 className="mt-1 font-display text-4xl font-bold text-ink">Messages</h1>
        <p className="mt-1 text-sm text-inkMuted">
          {messages.filter((m) => !m.read).length} unread · {messages.length} total
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-inkBorder bg-white p-12 text-center text-inkMuted shadow-sm">
            No messages yet.
          </div>
        ) : (
          messages.map((m) => <Row key={m.id} m={m} />)
        )}
      </div>
    </div>
  );
}

function Row({ m }: { m: Message }) {
  const [read, setRead] = useState(m.read);
  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm transition-colors ${
        read ? "border-inkBorder" : "border-terra/30"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-ink">{m.name}</p>
            {!read && (
              <span className="rounded-full bg-blush px-2 py-0.5 text-[10px] font-sans font-medium uppercase tracking-wider text-terra">
                New
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-inkMuted">
            {m.email && (
              <a href={`mailto:${m.email}`} className="flex items-center gap-1 hover:text-terra transition-colors">
                <Mail className="h-3 w-3" /> {m.email}
              </a>
            )}
            {m.phone && (
              <a href={`tel:${m.phone}`} className="flex items-center gap-1 hover:text-terra transition-colors">
                <Phone className="h-3 w-3" /> {m.phone}
              </a>
            )}
            <span>{new Date(m.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm text-inkMuted">{m.message}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            title={read ? "Mark unread" : "Mark read"}
            onClick={async () => {
              const next = !read;
              setRead(next);
              await markMessageRead(m.id, next);
            }}
            className="rounded-lg border border-inkBorder p-2 text-inkMuted transition-colors hover:border-terra/40 hover:text-terra"
          >
            {read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
          </button>
          <button
            title="Delete"
            onClick={async () => {
              try {
                await deleteMessage(m.id);
                toast.success("Deleted");
              } catch {
                toast.error("Delete failed");
              }
            }}
            className="rounded-lg border border-inkBorder p-2 text-inkMuted transition-colors hover:border-red-200 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
