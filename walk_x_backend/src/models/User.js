const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  photoUrl: {
    type: String,
    default: '',
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  height: {
    type: Number, // in cm
  },
  weight: {
    type: Number, // in kg
  },
  dailyGoal: {
    type: Number,
    default: 5000,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  rewardBalance: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    unique: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
