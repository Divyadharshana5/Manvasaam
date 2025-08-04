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

export const sendRegistrationNotification = async (userData: any) => {
  const recipient = EMAIL_TO;
  if (!recipient) {
    console.log(
      'No recipient email address configured (EMAIL_TO). Skipping email notification.'
    );
    return;
  }
  
  // Sanitize data before sending
  const { password, confirmPassword, ...safeUserData } = userData;

  const subject = `New User Registration on Manvaasam: ${
    safeUserData.username || safeUserData.branchName
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

  await sendEmail({
    to: recipient,
    subject,
    html,
  });
};
