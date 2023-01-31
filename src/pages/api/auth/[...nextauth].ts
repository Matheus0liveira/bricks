import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import {
  AUTH_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET_ID,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
  NODE_ENV,
} from '@/shared/constants';

export const authOptions: AuthOptions = {
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

  debug: NODE_ENV === 'development',
  secret: AUTH_SECRET,
  jwt: {
    secret: JWT_SECRET,
  },
  pages: {
    signIn: '/auth',
    signOut: '/auth',
  },
};

export default NextAuth(authOptions);
