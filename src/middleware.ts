import { withAuth } from "next-auth/middleware";

// Protect /admin/* but allow the public auth pages.
export default withAuth({
  pages: { signIn: "/admin/login" },
});

export const config = {
  matcher: [
    // Bare /admin and all sub-routes except login, forgot-password, reset-password
    "/admin",
    "/admin/((?!login|forgot-password|reset-password).*)",
  ],
};
