/** Is production flag */
export const IS_PROD = process.env.NODE_ENV === 'production';

/** Application HTTP Port */
export const APP_PORT = 8080;

/** App origin */
export const APP_ORIGIN = IS_PROD ? '.autograders.org' : 'http://localhost:3000';
