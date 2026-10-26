import { createClient } from "@supabase/supabase-js";

// Permissive database type — bypasses strict column-level inference so our
// server-side code compiles without generated types from `supabase gen types`.
// Using bare `any` for Row/Insert/Update avoids the `{}` inference quirk in
// Supabase JS v2 when a Record<string,any> is passed through the select transformer.
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

const globalForSupabase = globalThis as unknown as {
  supabase?: ReturnType<typeof createClient<Database>>;
};

if (!globalForSupabase.supabase) {
  globalForSupabase.supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
      global: {
        fetch: (url, options = {}) =>
          fetch(url, { ...options, keepalive: true }),
      },
    }
  );
}

export const supabase = globalForSupabase.supabase;
