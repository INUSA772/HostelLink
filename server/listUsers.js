require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await mongoose.connection.db.collection('users').find({}).project({ email: 1, role: 1 }).toArray();
  console.log(users);
  process.exit(0);
});