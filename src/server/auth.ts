import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/server/db";
import { compare } from "bcrypt";
import { env } from "@/env";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email?: string;
      name?: string;
      role?: string;
      phone?: string;
      image?: string;
    };
    token: {
      id: string;
      email: string;
      name: string;
      role?: string;
      phone?: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
    phone?: string;
    image?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          typeof credentials.email !== "string" ||
          !credentials?.password ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        if (user.password) {
          const isPasswordValid = await compare(
            credentials.password,
            user.password as string,
          );

          if (!isPasswordValid) {
            return null;
          }
        }

        return {
          id: `${user.id}`,
          email: `${user.email}`,
          name: `${user.name}`,
          role: `${user.role}`,
          phone: `${user.phone}`,
          image: `${user.image}`,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token, user }) => {
      const updatedUser = await db.user.findUnique({
        where: { id: token.id as string },
      });
      return {
        ...session,
        user: {
          ...session.user,
          role: updatedUser?.role as string | undefined,
          id: token.id as string,
          name: updatedUser?.name as string | undefined,
          email: updatedUser?.email as string | undefined,
          phone: updatedUser?.phone as string | undefined,
          image: updatedUser?.image as string | undefined,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user;
        token = {
          ...token,
          id: u.id,
          role: u.role,
        };
      }
      return token;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
