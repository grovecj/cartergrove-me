import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // The `authorized` callback in auth.config.ts handles allow/deny logic.
  // If we reach here without auth on a protected route, return 401 for API routes.
  // Page routes are automatically redirected to signIn page by NextAuth.
  if (!req.auth && req.nextUrl.pathname.startsWith("/api/admin")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
