import { createClient } from "@supabase/supabase-js";

type AnyTable = {
  Row: any;
  Insert: any;
  Update: any;
  Relationships: any[];
};
type Database = {
  public: {
    Tables: { [K: string]: AnyTable };
    Views: { [K: string]: { Row: any; Relationships: any[] } };
    Functions: { [K: string]: any };
    Enums: { [K: string]: any };
    CompositeTypes: { [K: string]: any };
  };
};

let _client: ReturnType<typeof createClient<Database>> | undefined;

/**
 * Returns the singleton Supabase admin client, creating it on first call.
 * Throws a clear error if the required env vars are absent — this surfaces
 * at request time, not at module-import time, so the build never crashes.
 */
export function getSupabase(): ReturnType<typeof createClient<Database>> {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[supabase] Missing required env vars: " +
        [!url && "NEXT_PUBLIC_SUPABASE_URL", !key && "SUPABASE_SERVICE_ROLE_KEY"]
          .filter(Boolean)
          .join(", ") +
        ".\nAdd them in Vercel → Project Settings → Environment Variables."
    );
  }

  _client = createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (u, options = {}) => fetch(u, { ...options, keepalive: true }),
    },
  });

  return _client;
}

/**
 * Backwards-compatible named export — every existing `import { supabase }` caller
 * works unchanged. The Proxy defers client creation to first property access so
 * importing this module never triggers createClient() during the build phase.
 */
export const supabase = new Proxy(
  {} as ReturnType<typeof createClient<Database>>,
  {
    get(_target, prop) {
      const client = getSupabase();
      const val = (client as any)[prop as string];
      return typeof val === "function" ? (val as (...a: unknown[]) => unknown).bind(client) : val;
    },
  }
);
