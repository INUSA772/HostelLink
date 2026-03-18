require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await mongoose.connection.db.collection('users').findOne(
    { email: 'bis22-minusa@mubas.com' }
  );
  console.log('Role:', user.role);
  console.log('isActive:', user.isActive);
  process.exit(0);
});