import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key';

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY !== 'your_public_key') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  userEmail: string,
  userName?: string,
  userType?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if EmailJS is properly configured
    if (EMAILJS_SERVICE_ID === 'service_your_id' || 
        EMAILJS_TEMPLATE_ID === 'template_your_id' || 
        EMAILJS_PUBLIC_KEY === 'your_public_key') {
      return {
        success: false,
        message: 'Email service is not configured. Please contact support for password reset.'
      };
    }

    // Generate a simple reset token (in production, this should be more secure)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(userEmail)}`;

    const templateParams = {
      to_email: userEmail,
      to_name: userName || 'User',
      user_type: userType || 'user',
      reset_link: resetLink,
      from_name: 'Manvasaam Support Team',
      message: `Hello ${userName || 'User'},\n\nWe received a request to reset your password for your ${userType || 'user'} account.\n\nClick the link below to reset your password:\n${resetLink}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nManvasaam Support Team`
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Password reset email sent successfully!'
      };
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    return {
      success: false,
      message: 'Email service is not available. Please contact support for password reset.'
    };
  }
};