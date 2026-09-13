const axios = require('axios');
const Settings = require('../models/Settings');
const ContactAccess = require('../models/ContactAccess');
const Hostel = require('../models/Hostel');

const PAYCHANGU_API = process.env.PAYCHANGU_API_BASE || 'https://api.paychangu.com';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/settings/contact-access — public, tells the frontend whether to
// paywall WhatsApp/Call buttons at all.
// ─────────────────────────────────────────────────────────────────────────────
exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    res.json({
      success: true,
      data: {
        enabled: settings.contactAccessPaymentEnabled,
        fee: settings.contactAccessFee,
      },
    });
  } catch (error) {
    console.error('[CONTACT SETTINGS ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/contact-access/initiate — public (no login; browsing is anonymous)
// ─────────────────────────────────────────────────────────────────────────────
exports.initiate = async (req, res) => {
  try {
    const { hostelId, payerPhone, payerName } = req.body;

    if (!hostelId || !payerPhone) {
      return res.status(400).json({ success: false, message: 'hostelId and payerPhone are required' });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const settings = await Settings.getSingleton();
    if (!settings.contactAccessPaymentEnabled) {
      return res.status(400).json({ success: false, message: 'Contact access payment is not enabled' });
    }

    const amount = settings.contactAccessFee;
    const transactionRef = `CA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const paychanguPayload = {
      amount,
      currency: 'MWK',
      email: `contact-access-${transactionRef}@pezanyumba.mw`,
      first_name: payerName || 'PezaNyumba',
      last_name: 'Visitor',
      phone_number: payerPhone,
      callback_url: `${process.env.BACKEND_URL}/api/contact-access/webhook`,
      return_url: `${process.env.FRONTEND_URL}/hostels/${hostelId}?contactTx=${transactionRef}`,
      tx_ref: transactionRef,
      customization: {
        title: `PezaNyumba - Contact Access`,
        description: `Unlock owner contact for ${hostel.name}`,
      },
    };

    let paychanguResponse;
    try {
      paychanguResponse = await axios.post(`${PAYCHANGU_API}/payment`, paychanguPayload, {
        headers: {
          Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });
    } catch (paychanguError) {
      console.error('[CONTACT ACCESS PAYCHANGU ERROR]', {
        status: paychanguError.response?.status,
        data: paychanguError.response?.data,
        message: paychanguError.message,
      });
      return res.status(500).json({
        success: false,
        message: paychanguError.response?.data?.message || 'Payment gateway error. Please try again.',
      });
    }

    const contactAccess = await ContactAccess.create({
      transactionId: transactionRef,
      paychanguReference: paychanguResponse.data?.data?.tx_ref || transactionRef,
      hostel: hostelId,
      payerPhone,
      amount,
      status: 'initiated',
    });

    const checkoutUrl =
      paychanguResponse.data?.data?.checkout_url ||
      paychanguResponse.data?.data?.link ||
      paychanguResponse.data?.checkout_url ||
      paychanguResponse.data?.link;

    if (!checkoutUrl) {
      console.error('[ERROR] No checkout URL:', paychanguResponse.data);
      return res.status(500).json({ success: false, message: 'Could not get payment URL from gateway. Please try again.' });
    }

    res.status(200).json({
      success: true,
      data: {
        transactionId: contactAccess.transactionId,
        paymentUrl: checkoutUrl,
        amount,
      },
    });
  } catch (error) {
    console.error('[CONTACT ACCESS INITIATE ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error initiating payment' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/contact-access/webhook — public, PayChangu calls this
// ─────────────────────────────────────────────────────────────────────────────
exports.handleWebhook = async (req, res) => {
  try {
    const { tx_ref, status } = req.body;

    if (!tx_ref || !status) {
      return res.status(400).json({ success: false, message: 'Missing tx_ref or status' });
    }

    const contactAccess = await ContactAccess.findOne({ transactionId: tx_ref });
    if (!contactAccess) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (['successful', 'success', 'completed'].includes(status)) {
      contactAccess.status = 'completed';
      contactAccess.paychanguStatus = status;
      contactAccess.completedAt = new Date();
      await contactAccess.save();
      return res.json({ status: 'ok', message: 'Payment successful' });
    } else if (['failed', 'declined'].includes(status)) {
      contactAccess.status = 'failed';
      contactAccess.paychanguStatus = status;
      await contactAccess.save();
      return res.json({ status: 'ok', message: 'Payment failed' });
    }

    contactAccess.paychanguStatus = status;
    await contactAccess.save();
    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('[CONTACT ACCESS WEBHOOK ERROR]', error);
    res.status(500).json({ message: 'Webhook error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/contact-access/verify/:transactionId — public
// ─────────────────────────────────────────────────────────────────────────────
exports.verify = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const contactAccess = await ContactAccess.findOne({ transactionId });

    if (!contactAccess) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (['initiated', 'processing'].includes(contactAccess.status)) {
      try {
        const verifyResponse = await axios.get(
          `${PAYCHANGU_API}/verify/${contactAccess.paychanguReference || contactAccess.transactionId}`,
          {
            headers: { Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}` },
            timeout: 10000,
          }
        );

        const paychanguStatus = verifyResponse.data?.data?.status;
        if (['successful', 'success'].includes(paychanguStatus)) {
          contactAccess.status = 'completed';
          contactAccess.paychanguStatus = paychanguStatus;
          contactAccess.completedAt = new Date();
          await contactAccess.save();
        }
      } catch (verifyError) {
        console.warn('[CONTACT ACCESS VERIFY ERROR]', verifyError.message);
      }
    }

    res.json({
      success: true,
      data: {
        transactionId: contactAccess.transactionId,
        status: contactAccess.status,
        hostelId: contactAccess.hostel,
      },
    });
  } catch (error) {
    console.error('[CONTACT ACCESS VERIFY ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error verifying payment' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/contact-access/reveal/:hostelId?transactionId=... — public
// This is the actual security boundary: only returns contact details when a
// real, server-verified, completed transaction exists for this exact hostel.
// ─────────────────────────────────────────────────────────────────────────────
exports.reveal = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const { transactionId } = req.query;

    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'transactionId is required' });
    }

    const contactAccess = await ContactAccess.findOne({
      transactionId,
      hostel: hostelId,
      status: 'completed',
    });

    if (!contactAccess) {
      return res.status(403).json({ success: false, message: 'Payment not verified for this property' });
    }

    const hostel = await Hostel.findById(hostelId).select('contactPhone whatsapp');
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({
      success: true,
      data: {
        contactPhone: hostel.contactPhone,
        whatsapp: hostel.whatsapp,
      },
    });
  } catch (error) {
    console.error('[CONTACT ACCESS REVEAL ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error revealing contact' });
  }
};
