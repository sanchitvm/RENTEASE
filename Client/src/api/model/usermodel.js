const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String },
  userType: { type: String },
  age: { type: Number },
  gender: { type: String },
  maritalStatus: { type: String },
  verified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
}, { timestamps: true });

// Export the schema so different mongoose instances can register it locally
module.exports = { UserSchema };
