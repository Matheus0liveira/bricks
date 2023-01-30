import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prismadb';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET_ID,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
} from '@/shared/constants';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET_ID,
    }),
  ],

  secret: JWT_SECRET,
  pages: {
    signIn: '/auth',
    signOut: '/auth',
  },
};

export default NextAuth(authOptions);

type CredentialsLogin = {
  email: string;
  password: string;
};
