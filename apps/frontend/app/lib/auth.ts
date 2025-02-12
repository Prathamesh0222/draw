import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

declare module "next-auth" {
  interface User {
    backendToken?: string;
  }
  interface Session {
    backendToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
  }
}

export const authOptions = {
  sessions: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      if (!user.email) return false;

      try {
        let dbUser = await prismaClient.user.findFirst({
          where: {
            email: user.email,
          },
        });
        if (!dbUser) {
          dbUser = await prismaClient.user.create({
            data: {
              email: user.email,
              username: user.name || "",
              password: "",
            },
          });
        }

        const backendToken = jwt.sign(
          {
            userId: dbUser.id,
          },
          JWT_SECRET
        );

        user.backendToken = backendToken;

        return true;
      } catch (error) {
        console.error("Error in signIn callback", error);
        return false;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.backendToken = token.backendToken;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.backendToken = user.backendToken;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
