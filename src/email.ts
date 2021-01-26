import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import nodemailer from 'nodemailer';
import constants from './constants';

import { Auth } from 'googleapis';

/**
 * OAuth2 client
 */
const oauth2Client = new Auth.OAuth2Client({
  clientId: process.env.GMAIL_CLIENT,
  clientSecret: process.env.GMAIL_SECRET,
  redirectUri: process.env.GMAIL_REDIRECT_URI
});

oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_TOKEN });

/**
 * Gets OAuth2 access token
 */
function getAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    oauth2Client
      .getAccessToken()
      .then((value) => {
        resolve(value.token || '');
      })
      .catch(() => {
        reject('Could Not Get Access Token');
      });
  });
}

/**
 * Email interface.
 */
interface Email {
  /** Email recipient */
  to: string;
  /** Email subject */
  subject: string;
  /** Email template */
  template: string;
  /** Email template data */
  data: ejs.Data | undefined;
}

/**
 * Renders an email template.
 *
 * @param template - Email template
 * @param data     - Email template data
 */
function renderTemplate(template: string, data: ejs.Data | undefined): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const filename = path.join(__dirname, 'templates', template);
    try {
      resolve(ejs.render(fs.readFileSync(filename, 'utf-8'), data));
    } catch (error) {
      reject('Could not render template');
    }
  });
}

/**
 * Sends an email.
 *
 * @param email - Email data
 */
export async function sendEmail(email: Email) {
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT,
        clientSecret: process.env.GMAIL_SECRET,
        refreshToken: process.env.GMAIL_TOKEN,
        accessToken: await getAccessToken()
      }
    });
    transport.sendMail({
      from: constants.NOREPLY_EMAIL,
      to: email.to,
      subject: email.subject,
      text: await renderTemplate(`${email.template}.txt`, email.data),
      html: await renderTemplate(`${email.template}.ejs`, email.data)
    });
  } catch (error) {
    // Ignore errors
  }
}
