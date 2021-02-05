import ejs from 'ejs';
import path from 'path';
import nodemailer from 'nodemailer';

/**
 * Privateemail mail transport
 */
const transport = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  secure: false,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Renders an EJS email template.
 *
 * @param template Template name
 */
function renderTemplate(template: string, data: any, text: boolean = false): Promise<string> {
  const extension = text ? '.txt' : '.ejs';
  return new Promise<string>((resolve, reject) => {
    const p = path.join(__dirname, 'templates', `${template}${extension}`);
    ejs.renderFile(p, data, (error, rendered) => {
      if (error) {
        reject(error);
      } else {
        resolve(rendered);
      }
    });
  });
}

/**
 * Sends welcome email.
 *
 * @param email - Recipient
 * @param url   - Redirect URL
 */
export async function sendWelcomeEmail(email: string, url: string) {
  const data = { email, url };
  transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email for Autograders.org',
    html: await renderTemplate('welcome', data),
    text: await renderTemplate('welcome', data, true)
  });
}
