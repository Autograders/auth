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
 * Sends an email.
 *
 * @param to      - Recipient
 * @param subject - Email subject
 * @param email   - Email data
 */
export async function sendEmail(to: string, subject: string, text: string) {
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
      to,
      subject,
      text
    });
  } catch (error) {
    // Ignore errors
  }
}
