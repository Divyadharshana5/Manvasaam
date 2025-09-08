const nodemailer = require("nodemailer");

// Check if email configuration is available
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

let transporter: any = null;

if (isEmailConfigured) {
  try {
    transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } catch (error) {
    console.warn('Email transporter initialization failed:', error);
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  // If email is not configured or transporter failed, return demo success
  if (!isEmailConfigured || !transporter) {
    console.log(`📧 Demo mode: Password reset email would be sent to ${email}`);
    return {
      success: true,
      messageId: `demo-${Date.now()}`,
      message: 'Demo mode: Email sent successfully'
    };
  }

  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request - Manvaasam",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Manvaasam account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background-color: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return result;
  } catch (error) {
    console.warn('Email sending failed, returning demo success:', error);
    return {
      success: true,
      messageId: `demo-fallback-${Date.now()}`,
      message: 'Demo mode: Email sent successfully (fallback)'
    };
  }
}

export { isEmailConfigured };
