export default {
  /** Sign in url */
  SIGN_IN: '',
  /** Token expired redirect url */
  TOKEN_EXPIRED: '',
  /** Something went wrong  */
  SOMETHING_WENT_WRONG: '',
  /** Verify url */
  VERIFY: '',
  /** API url */
  API: process.env.NODE_ENV === 'production' ? 'https://api.autograders.org' : 'http://localhost:8080'
};
