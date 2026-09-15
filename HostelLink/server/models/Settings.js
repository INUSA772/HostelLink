const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global',
    },
    contactAccessPaymentEnabled: {
      type: Boolean,
      default: false,
    },
    contactAccessFee: {
      type: Number,
      default: 500,
      min: 0,
    },
    ownerVerificationEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// There is only ever one settings document ({ key: 'global' }) — get or create it.
settingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne({ key: 'global' });
  if (!settings) {
    settings = await this.create({ key: 'global' });
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
