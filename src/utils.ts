import { utc } from 'moment';
import { renderFile } from 'ejs';

/**
 * Generates a random pin code.
 *
 * @param length - Pin length
 * @returns Random pin code
 */
export function generatePin(length: number = 6): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * alphabet.length);
    code += alphabet.charAt(index);
  }
  return code;
}

/**
 * Gets UTC date.
 *
 * @returns UTC date
 */
export function getUTC() {
  return utc().toDate();
}

/**
 * Renders an EJS email template.
 *
 * @param template Template name
 */
export function renderTemplate(path: string, data: any): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    renderFile(path, data, (error, rendered) => {
      if (error) {
        reject(error);
      } else {
        resolve(rendered);
      }
    });
  });
}

/**
 * Validates if the given token has a proper structure.
 *
 * @param token - Bearer token
 */
export function validateTokenStructure(token: string | undefined | null) {
  if (typeof token !== 'string' || token === '') return false;
  if (!token.toLocaleLowerCase().startsWith('bearer ')) return false;
  return true;
}
