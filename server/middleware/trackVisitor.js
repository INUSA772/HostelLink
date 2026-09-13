const { v4: uuidv4 } = require('uuid');
const Visitor = require('../models/Visitor');

module.exports = async (req, res) => {
  try {
    let fp = req.cookies?.vfp;
    if (!fp) {
      fp = uuidv4();
      res.cookie('vfp', fp, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Only update if this fingerprint hasn't been seen today
    const existing = await Visitor.findOne({ fingerprint: fp });

    if (existing && existing.lastSeen >= today) {
      // Already counted today — just update online status silently
      await Visitor.updateOne({ fingerprint: fp }, { $set: { lastSeen: new Date(), isOnline: true } });
      return res.json({ success: true, counted: false });
    }

    const userId = req.user?._id || null;

    await Visitor.findOneAndUpdate(
      { fingerprint: fp },
      {
        $set:         { lastSeen: new Date(), isOnline: true, userId },
        $inc:         { visitCount: 1 },
        $setOnInsert: { firstSeen: new Date(), fingerprint: fp },
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, counted: true });
  } catch (err) {
    res.json({ success: false });
  }
};