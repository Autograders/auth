/** Is production flag */
export const IS_PROD = process.env.NODE_ENV === 'production';

/** Application HTTP Port */
export const APP_PORT = 8080;

/** App origin */
export const APP_ORIGIN = process.env.APP_ORIGIN as string;

/** JWT secret key */
export const JWT_SECRET = process.env.JWT_SECRET as string;

/** JWT refresh secret key */
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

/** JWT access token time */
export const ACCESS_TOKEN_TIME = process.env.ACCESS_TOKEN_TIME as string;

/** JWT refresh token time */
export const REFRESH_TOKEN_TIME = process.env.REFRESH_TOKEN_TIME as string;

/** Refresh token key */
export const REFRESH_COOKIE = process.env.REFRESH_COOKIE as string;

/** Email domain */
export const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN as string;

/** Pin length */
export const PIN_LENGTH = 6;

/** Password regex */
export const PASSWORD_RGX = /^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{8,128}$/;
