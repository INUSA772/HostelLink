require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Usage: node server/resetPassword.js <email> <newPassword>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashed = await bcrypt.hash(newPassword, 10);
  const result = await mongoose.connection.db.collection('users').updateOne(
    { email },
    { $set: { password: hashed } }
  );

  if (result.matchedCount === 0) {
    console.log('No user found with that email.');
  } else {
    console.log(`Password reset for ${email}. Modified: ${result.modifiedCount}`);
  }
  process.exit(0);
});
