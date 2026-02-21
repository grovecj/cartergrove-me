import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

const ALLOWED_USERNAME = "grovecj";

export default {
  providers: [
    GitHub({
      clientId: (process.env.OAUTH_GITHUB_CLIENT_ID ?? process.env.GITHUB_CLIENT_ID)!,
      clientSecret: (process.env.OAUTH_GITHUB_CLIENT_SECRET ?? process.env.GITHUB_CLIENT_SECRET)!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return profile?.login === ALLOWED_USERNAME;
    },
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      // Allow the login page and NextAuth API routes
      if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) {
        return true;
      }

      // Require auth for admin routes
      return !!auth;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
} satisfies NextAuthConfig;
