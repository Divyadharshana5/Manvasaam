# EmailJS Setup Instructions

This project uses EmailJS to send password reset emails automatically when users click "Forgot Password" on any login page.

## Setup Steps

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

### 3. Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: Password Reset Request - Manvasaam

Hello {{to_name}},

We received a request to reset your password for your {{user_type}} account on Manvasaam.

Click the link below to reset your password:
{{reset_link}}

If you didn't request this password reset, please ignore this email.

Best regards,
The Manvasaam Team
```

4. Note down your **Template ID**

### 4. Get Public Key
1. Go to "Account" > "General"
2. Find your **Public Key**

### 5. Update Environment Variables
Update your `.env` file with your EmailJS credentials:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## Template Variables

The email template uses these variables:
- `{{to_email}}` - Recipient's email address
- `{{to_name}}` - User's name (branch name for hubs, username for others)
- `{{user_type}}` - Type of user (hub, customer, restaurant, farmer)
- `{{reset_link}}` - Generated password reset link
- `{{from_name}}` - Sender name (Manvasaam Support Team)
- `{{message}}` - Full formatted message

## How It Works

1. User enters their email and clicks "Forgot Password"
2. System automatically generates a reset token and link
3. EmailJS sends the email with the reset link
4. User clicks the link and is redirected to the password reset page
5. User enters new password and confirms the reset

## Features

- ✅ Automatic email sending without server-side code
- ✅ Works for all user types (Hub, Customer, Restaurant, Farmer)
- ✅ Personalized emails with user names and types
- ✅ Secure reset tokens and links
- ✅ Professional email templates
- ✅ No additional backend required

## Testing

1. Make sure your EmailJS credentials are properly set in `.env`
2. Go to any login page
3. Enter a valid email address
4. Click "Forgot Password"
5. Check your email inbox for the reset link

## Troubleshooting

- **Email not received**: Check spam folder, verify EmailJS service is active
- **Invalid credentials**: Double-check your Service ID, Template ID, and Public Key
- **Template errors**: Ensure all template variables are properly formatted with double curly braces

## Security Notes

- Reset tokens are generated client-side for demo purposes
- In production, implement server-side token generation and validation
- Consider adding token expiration times
- Implement rate limiting for password reset requests