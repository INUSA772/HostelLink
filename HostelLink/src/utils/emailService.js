// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send a password reset email
 */
const sendPasswordResetEmail = async (toEmail, resetToken, firstName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"HostelLink" <${process.env.SMTP_FROM}>`,
    to: toEmail,
    subject: 'Reset Your HostelLink Password',
    html: `
      <div style="font-family: 'Manrope', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f4f6fa; padding: 32px 16px;">
        <div style="background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(13,27,62,0.10);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0d1b3e 0%, #112255 100%); padding: 32px 32px 24px; text-align: center;">
            <div style="display: inline-block; background: #e8501a; border-radius: 10px; padding: 10px 18px; margin-bottom: 12px;">
              <span style="color: #fff; font-size: 1.1rem; font-weight: 800; letter-spacing: 1px;">🏠 HostelLink</span>
            </div>
            <h1 style="color: #fff; font-size: 1.3rem; font-weight: 700; margin: 0;">Password Reset Request</h1>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <p style="color: #111827; font-size: 0.95rem; margin-bottom: 8px;">Hi <strong>${firstName}</strong>,</p>
            <p style="color: #4b5563; font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px;">
              We received a request to reset your HostelLink password. Click the button below to create a new password. This link will expire in <strong>1 hour</strong>.
            </p>

            <!-- Button -->
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${resetUrl}" style="display: inline-block; background: #e8501a; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.3px;">
                Reset My Password
              </a>
            </div>

            <p style="color: #6b7280; font-size: 0.8rem; line-height: 1.6; margin-bottom: 8px;">
              Or copy and paste this link in your browser:
            </p>
            <p style="background: #f4f6fa; border-radius: 6px; padding: 10px 12px; font-size: 0.75rem; color: #1a3fa4; word-break: break-all; margin-bottom: 24px;">
              ${resetUrl}
            </p>

            <hr style="border: none; border-top: 1px solid #e4e6eb; margin-bottom: 20px;" />

            <p style="color: #9ca3af; font-size: 0.78rem; line-height: 1.5;">
              If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f4f6fa; padding: 16px 32px; text-align: center;">
            <p style="color: #9ca3af; font-size: 0.72rem; margin: 0;">
              © ${new Date().getFullYear()} HostelLink · Off-Campus Accommodation · Blantyre, Malawi
            </p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };