import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

// In-memory rate limiter: 5 failures per email per 15 minutes.
const attempts = new Map<string, { n: number; until: number }>();

function checkAttempt(email: string): boolean {
  const key = email.toLowerCase();
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now > rec.until) {
    attempts.set(key, { n: 1, until: now + 15 * 60_000 });
    return true;
  }
  if (rec.n >= 5) return false;
  rec.n++;
  return true;
}

function clearAttempts(email: string) {
  attempts.delete(email.toLowerCase());
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        if (!checkAttempt(credentials.email)) return null;

        const { data: admin } = await supabase
          .from("admin")
          .select("id, email, name, password_hash")
          .eq("email", credentials.email.toLowerCase())
          .single();

        if (!admin) return null;

        const valid = await bcrypt.compare(credentials.password, admin.password_hash);
        if (!valid) return null;

        clearAttempts(credentials.email);
        return { id: admin.id, email: admin.email, name: admin.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
