require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await mongoose.connection.db.collection('users').updateOne(
    { email: 'bis22-minusa@mubas.com' },
    { $set: { role: 'admin' } }
  );
  console.log('Updated:', result.modifiedCount);
  process.exit(0);
});