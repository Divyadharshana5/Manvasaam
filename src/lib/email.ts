
import nodemailer from 'nodemailer';

const {
  EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT,
  EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD,
  EMAIL_FROM,
  EMAIL_TO,
} = process.env;

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

const smtpOptions = {
  host: EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(EMAIL_SERVER_PORT || '465', 10),
  secure: true,
  auth: {
    user: EMAIL_SERVER_USER,
    pass: EMAIL_SERVER_PASSWORD,
  },
};

export const sendEmail = async (data: EmailPayload) => {
  if (!EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
    console.log('Email server not configured. Skipping email.');
    // In a production app, you'd want to handle this more gracefully.
    // For now, we'll just log to the console and not throw an error.
    return;
  }

  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  });

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      ...data,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    // Decide if you want to throw the error or handle it silently.
    // Throwing might be better to know that something went wrong.
    throw new Error('Failed to send email.');
  }
};

export const sendRegistrationNotification = async (userData: any, restaurantId?: string, branchId?: string) => {
  const adminRecipient = EMAIL_TO;
  
  // Sanitize data before sending
  const { password, confirmPassword, ...safeUserData } = userData;

  // Send notification to Admin only if the recipient is configured
  if (adminRecipient) {
    const subject = `New User Registration on Manvaasam: ${
      safeUserData.username || safeUserData.branchName || safeUserData.restaurantName
    }`;
    const userDetailsHtml = Object.entries(safeUserData)
      .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
      .join('');

    const html = `
          <h1>New User Registration</h1>
          <p>A new user has registered on the Manvaasam platform.</p>
          <h2>User Details:</h2>
          <ul>
              ${userDetailsHtml}
          </ul>
      `;
    await sendEmail({ to: adminRecipient, subject, html });
  } else {
     console.log('No recipient email address configured (EMAIL_TO). Skipping admin email notification.');
  }


  // Send Restaurant ID to the newly registered restaurant
  if (userData.userType === 'restaurant' && restaurantId) {
    const subject = "Welcome! Here is Your Restaurant Registration ID";
    const html = `
      <p>Dear ${userData.restaurantName},</p>
      <p>Thank you for registering your restaurant with us!</p>
      <p>Your unique Restaurant ID is: <strong>${restaurantId}</strong></p>
      <p>Please keep this ID for your records. You will need it for future logins and support.</p>
      <p>If you have any questions, reply to this email or contact our team.</p>
      <br>
      <p>Best regards,</p>
      <p>The Manvaasam Team</p>
    `;

    await sendEmail({ to: userData.email, subject, html });
  }
  
  // Send Branch ID to the newly registered hub
  if (userData.userType === 'hub' && branchId) {
    const subject = "Welcome! Here is Your Hub Branch ID";
    const html = `
      <p>Dear ${userData.branchName},</p>
      <p>Thank you for registering your hub with us!</p>
      <p>Your unique Branch ID is: <strong>${branchId}</strong></p>
      <p>Please keep this ID for your records. You will need it for future logins and support.</p>
      <br>
      <p>Best regards,</p>
      <p>The Manvaasam Team</p>
    `;

    await sendEmail({ to: userData.email, subject, html });
  }

};

export const sendPasswordResetEmail = async ({email, link}: {email: string, link: string}) => {
    const subject = "Reset Your Password for Manvaasam";
    const html = `
      <h1>Password Reset Request</h1>
      <p>You are receiving this email because a password reset was requested for your account.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${link}" target="_blank" rel="noopener noreferrer">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
      <br>
      <p>Thanks,</p>
      <p>The Manvaasam Team</p>
    `;

    await sendEmail({
        to: email,
        subject,
        html,
    });
}

    

    