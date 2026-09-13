const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, resetToken, firstName) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"HostelLink" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: 'HostelLink - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: #2563eb; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">HostelLink</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2>Hello ${firstName},</h2>
          <p>You requested a password reset for your HostelLink account.</p>
          <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #2563eb; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email. Your account is safe.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">HostelLink - MUBAS Student Hostel Platform</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send booking confirmation email
exports.sendBookingConfirmationEmail = async (email, bookingDetails) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"HostelLink" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `HostelLink - Booking Confirmed at ${bookingDetails.hostelName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #16a34a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Booking Confirmed!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #eee;">
          <h2>Hello ${bookingDetails.studentName},</h2>
          <p>Your booking has been confirmed successfully.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold;">Hostel:</td>
              <td style="padding: 10px;">${bookingDetails.hostelName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Check-in:</td>
              <td style="padding: 10px;">${bookingDetails.checkIn}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; font-weight: bold;">Duration:</td>
              <td style="padding: 10px;">${bookingDetails.duration} month(s)</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Amount Paid:</td>
              <td style="padding: 10px;">MWK ${bookingDetails.amount?.toLocaleString()}</td>
            </tr>
          </table>
          <p style="color: #666; font-size: 14px;">Thank you for using HostelLink!</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};