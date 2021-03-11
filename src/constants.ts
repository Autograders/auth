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

/** S3 bucket name */
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string;

/** Pin length */
export const PIN_LENGTH = 6;

/** Password regex */
export const PASSWORD_RGX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
