require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

async function checkUser() {
  try {
    const user = await User.findOne({ email: 'demo@mockmate.com' }).select('+password');
    console.log('User found:', {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      password: user?.password ? `[${user.password.length} chars]` : 'NULL',
      passwordType: typeof user?.password
    });
    
    // Also check the original test user
    const testUser = await User.findOne({ email: 'testemail@gmail.com' }).select('+password');
    console.log('Test user found:', {
      _id: testUser?._id,
      name: testUser?.name,
      email: testUser?.email,
      password: testUser?.password ? `[${testUser.password.length} chars]` : 'NULL',
      passwordType: typeof testUser?.password
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser();
