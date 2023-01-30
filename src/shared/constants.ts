function getEnv(env: string) {
  return process.env[env || ''];
}

export const GOOGLE_CLIENT_ID = getEnv('GOOGLE_CLIENT_ID') || '';
export const GOOGLE_CLIENT_SECRET = getEnv('GOOGLE_CLIENT_SECRET') || '';
export const GITHUB_CLIENT_ID = getEnv('GITHUB_CLIENT_ID') || '';
export const GITHUB_CLIENT_SECRET_ID = getEnv('GITHUB_CLIENT_SECRET_ID') || '';
export const JWT_SECRET = getEnv('JWT_SECRET') || '';
