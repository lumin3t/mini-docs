import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      organizationId?: string | null;
    } & DefaultSession["user"];
  }
}