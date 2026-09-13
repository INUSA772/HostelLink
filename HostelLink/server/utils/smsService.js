let AfricasTalking;
try {
  AfricasTalking = require('africastalking');
} catch {
  console.warn('africastalking package not installed. Run: npm install africastalking');
}

const formatMalawiPhone = (phone) => {
  if (!phone) return null;
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('265')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+265${cleaned.slice(1)}`;
  if (cleaned.length === 9) return `+265${cleaned}`;
  return `+${cleaned}`;
};

const getAT = () => {
  if (!AfricasTalking) return null;
  if (!process.env.AT_API_KEY) {
    console.warn('Africa\'s Talking API key not set in .env');
    return null;
  }
  return AfricasTalking({
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME || 'sandbox',
  });
};

const sendSMS = async (phone, message) => {
  const at = getAT();
  if (!at) {
    console.log(`[SMS DISABLED] To: ${phone} | Message: ${message}`);
    return { success: false, reason: 'SMS service not configured' };
  }

  const formattedPhone = formatMalawiPhone(phone);
  if (!formattedPhone) {
    return { success: false, reason: 'Invalid phone number' };
  }

  try {
    const sms = at.SMS;
    const result = await sms.send({
      to: [formattedPhone],
      message,
      from: process.env.AT_SENDER_ID || 'HOSTELLINK',
    });
    console.log(`SMS sent to ${formattedPhone}:`, result);
    return { success: true, result };
  } catch (error) {
    console.error('SMS send error:', error.message);
    return { success: false, error: error.message };
  }
};

// SMS Templates
exports.sendBookingConfirmedSMS = async (phone, data) => {
  const message = `HostelLink: Booking confirmed at ${data.hostelName}! Check-in: ${data.checkIn}. Ref: ${data.bookingId}. Welcome!`;
  return sendSMS(phone, message);
};

exports.sendPaymentSuccessSMS = async (phone, data) => {
  const message = `HostelLink: Payment of MWK ${data.amount?.toLocaleString()} received for ${data.hostelName}. Txn: ${data.transactionId}. Thank you!`;
  return sendSMS(phone, message);
};

exports.sendPaymentFailedSMS = async (phone, data) => {
  const message = `HostelLink: Payment failed for ${data.hostelName}. Amount: MWK ${data.amount?.toLocaleString()}. Please try again or contact support.`;
  return sendSMS(phone, message);
};

exports.sendNewBookingOwnerSMS = async (phone, data) => {
  const message = `HostelLink: New booking request for ${data.hostelName} from ${data.studentName}. Log in to manage bookings.`;
  return sendSMS(phone, message);
};

exports.sendRoomAvailableSMS = async (phone, data) => {
  const message = `HostelLink: A room is now available at ${data.hostelName}! Book now at hostellink.mubas.ac.mw before it's taken.`;
  return sendSMS(phone, message);
};

exports.sendPasswordResetSMS = async (phone, data) => {
  const message = `HostelLink: Your password reset OTP is ${data.otp}. Valid for 10 minutes. Do not share this code.`;
  return sendSMS(phone, message);
};