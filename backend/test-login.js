require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testLogin() {
  try {
    const email = 'demo@mockmate.com';
    const password = 'Demo@123';
    
    console.log('Testing login for:', email);
    
    // First, try without select to see what we get
    const userWithoutSelect = await User.findOne({ email }).lean();
    console.log('User without select:', userWithoutSelect);
    
    // Then try with correct select syntax
    const user = await User.findOne({ email }).select('+password').lean();
    console.log('User with select:', user);
    
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    
    if (!user.password) {
      console.log('User has no password');
      process.exit(1);
    }
    
    console.log('Comparing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testLogin();
