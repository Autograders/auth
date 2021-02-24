import { join } from 'path';
import { createTransport } from 'nodemailer';
import { getUTC, renderTemplate } from '@utils';

/**
 * Privateemail mail transport
 */
const transport = createTransport({
  host: 'mail.privateemail.com',
  secure: false,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Sends pin to email.
 *
 * @param email - Recipient
 * @param code  - Pin code
 */
export async function sendPin(email: string, code: string) {
  const data = { code, year: getUTC().getFullYear() };
  transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Autograders confirmation code: ${code}`,
    html: await renderTemplate(join(__dirname, 'templates', 'html', 'pin.html'), data),
    text: await renderTemplate(join(__dirname, 'templates', 'text', 'pin.txt'), data)
  });
}
