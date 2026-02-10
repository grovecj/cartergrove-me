import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const ALLOWED_USERNAME = "grovecj";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
});
