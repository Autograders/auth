/** Is production flag */
export const IS_PROD = process.env.NODE_ENV === 'production';

/** Application HTTP Port */
export const APP_PORT = 8080;

/** App origin */
export const APP_ORIGIN = IS_PROD ? '.autograders.org' : 'http://localhost:3000';

/** JWT secret key */
export const JWT_SECRET = process.env.JWT_SECRET as string;

/** JWT refresh secret key */
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

/** JWT access token time */
export const ACCESS_TOKEN_TIME = process.env.ACCESS_TOKEN_TIME;

/** JWT refresh token time */
export const REFRESH_TOKEN_TIME = process.env.REFRESH_TOKEN_TIME;

/** Refresh token key */
export const REFRESH_COOKIE = 'refresh_token';
