import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

type Ctx = {
  session: Session;
} & GetServerSidePropsContext;

export function getServerSideSession<P extends Record<string, unknown>>(
  fn: GetServerSideProps<P>
) {
  return async (ctx: Ctx): Promise<GetServerSidePropsResult<P>> => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (!session) {
      return {
        redirect: {
          destination: '/auth',
          permanent: false,
        },
      };
    }

    ctx.session = session;

    return await fn(ctx);
  };
}
