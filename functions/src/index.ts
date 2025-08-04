/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onObjectFinalized } from "firebase-functions/v2/storage";
import { logger } from "firebase-functions";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();
admin.initializeApp();

// Email configuration from .env file
const mailTransport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const APP_NAME = "Manvaasam";
const NOTIFICATION_EMAIL = "slytherinpls8@gmail.com";

/**
 * Sends a welcome email to new users.
 */
export const sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.

  if (!email) {
    logger.error("User has no email address.", { uid: user.uid });
    return;
  }

  const mailOptions = {
    from: `"${APP_NAME}" <noreply@firebase.com>`,
    to: email,
    subject: `Welcome to ${APP_NAME}!`,
    text: `Hey ${
      displayName || ""
    }!, Welcome to ${APP_NAME}. We hope you will enjoy our service.`,
  };

  const notificationMailOptions = {
    from: `"${APP_NAME} Admin" <noreply@firebase.com>`,
    to: NOTIFICATION_EMAIL,
    subject: `New User Registration: ${email}`,
    text: `A new user has registered on ${APP_NAME}.
      \n\n
      User Details:
      Email: ${email}
      Display Name: ${displayName || "Not provided"}
      UID: ${user.uid}
      Creation Time: ${user.metadata.creationTime}`,
  };

  return Promise.all([
    mailTransport.sendMail(mailOptions),
    mailTransport.sendMail(notificationMailOptions),
  ])
    .then(() => logger.log(`Emails sent for new user:`, email))
    .catch((error) =>
      logger.error("There was an error while sending the emails:", error)
    );
});
