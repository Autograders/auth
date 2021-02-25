import { renderFile } from 'ejs';
import { PIN_LENGTH } from '@constants';

/**
 * Generates a random pin code.
 *
 * @returns Random pin code
 */
export function generatePin(): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < PIN_LENGTH; i++) {
    const index = Math.floor(Math.random() * alphabet.length);
    code += alphabet.charAt(index);
  }
  return code;
}

/**
 * Gets UTC date.
 *
 * @param from - From date
 * @returns UTC date
 */
export function getUTC(from?: string) {
  if (from) {
    const date = new Date(from);
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
  }
  return new Date();
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
