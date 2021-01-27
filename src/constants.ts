export default {
  /** Application Port */
  APP_PORT: 5000,
  /** Databse URL */
  DB_URL: process.env.DB_URL as string,
  /** Email domain */
  EMAIL_DOMAIN: '@galileo.edu',
  /** no-reply email */
  NOREPLY_EMAIL: 'noreply@autograders.org',
  /** Is production flag */
  IS_PROD: process.env.NODE_ENV === 'production',
  /** Domain*/
  DOMAIN: process.env.NODE_ENV === 'production' ? '.autograders.org' : 'http://localhost:3000',
  /** API domain */
  API: process.env.NODE_ENV === 'production' ? 'https://api.autograders.org' : 'http://localhost:5000',
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
