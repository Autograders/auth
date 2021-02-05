import path from 'path';
import pino from 'pino';

export default {
  /** Application root logger */
  LOGGER: pino(pino.destination({ dest: 'autograders.log' })),
  /** Application HTTP Port */
  APP_PORT: process.env.NODE_ENV === 'production' ? 8043 : 8080,
  /** Application SSL key */
  APP_SSL_KEY: path.join(__dirname, '..', 'ssl', 'autograders.key'),
  /** Application SSL crt */
  APP_SSL_CRT: path.join(__dirname, '..', 'ssl', 'autograders.crt'),
  /** Databse URL */
  DB_URL: process.env.DB_URL as string,
  /** AWS S3 bucket name */
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME as string,
  /** Email domain */
  EMAIL_DOMAIN: '@galileo.edu',
  /** Is production flag */
  IS_PROD: process.env.NODE_ENV === 'production',
  /** Password complexity */
  PASSWORD_COMPLEXITY: {
    min: 8,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 6
  },
  /** JWT access token secret */
  JWT_SECRET: process.env.JWT_SECRET as string,
  /** JWT refresh token secret */
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  /** JWT verify token secret */
  JWT_VERIFY_SECRET: process.env.JWT_VERIFY_SECRET as string,
  /** Access token expiration time */
  TOKEN_TIME: '15m',
  /** Refresh token time */
  REFRESH_TOKEN_TIME: '2d',
  /** Verify token time */
  VERIFY_TOKEN_TIME: '1d'
};
