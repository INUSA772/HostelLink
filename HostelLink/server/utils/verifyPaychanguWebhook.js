const crypto = require('crypto');

// PayChangu signs each webhook with a SHA-256 HMAC (hex) of the raw request
// body, sent in the "Signature" header. Verifying this means a webhook call
// can only originate from someone who holds our PAYCHANGU_WEBHOOK_SECRET —
// i.e. actually PayChangu — rather than anyone who discovers the URL.
// https://developer.paychangu.com/docs/webhooks
function verifyPaychanguWebhook(req) {
  const secret = process.env.PAYCHANGU_WEBHOOK_SECRET;
  const signature = req.headers['signature'];

  if (!secret || !signature || !req.rawBody) return false;

  const expected = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
  } catch {
    return false; // signature header wasn't valid hex / wrong length
  }
}

module.exports = verifyPaychanguWebhook;
