require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs'); // Using bcrypt for password hashing
const crypto = require('crypto');
const cors = require('cors');
const dns = require('dns');

// Fix for MongoDB resolution issues: Use Google DNS to bypass local DNS problems
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Fix for MongoDB SRV resolution issues in Node 17+
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}


const port = process.env.PORT || 5000;

const app = express();

// Middleware and configuration
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the JWT secret from .env
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Invalid or expired token' });
  }
};

app.get('/ping', (req, res) => res.json({ msg: 'Auth Server is alive!', status: 'OK', port: 5000 }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => {
    console.error('MongoDB connection error details:');
    console.error('Code:', err.code);
    console.error('Syscall:', err.syscall);
    console.error('Hostname:', err.hostname);
    console.error('Full Error:', err);
  });


// Use shared User schema and register on local mongoose instance to prevent instance mismatch
const { UserSchema } = require('../Client/src/api/model/usermodel');
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Review Schema & Model
const ReviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String,
  userEmail: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', ReviewSchema);

// Validation Schemas with Zod
const emailSchema = zod.string().email();
const passwordSchema = zod.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number");
const contactSchema = zod
  .string()
  .regex(/^(\+\d{1,3})?\d{10}$/, "Contact number must be 10 digits long (optional country code supported, e.g., 1234567890 or +911234567890)");

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER, // Use email from .env
    pass: process.env.EMAIL_PASS, // Use password from .env
  },
});

// Helper Functions
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10); // bcrypt to hash password
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword); // bcrypt to compare password
};

// Contact Us Endpoint
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, phone, message, subject } = req.body;

  const mailOptions = {
    from: `${firstName} ${lastName} <${email}>`,
    to: process.env.EMAIL_USER, // Use email from .env as the receiver
    subject: 'New Contact Form Submission: ' + subject,
    text: `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      Subject: ${subject}
      Message: ${message}
    `
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Failed to send message', error: err.message });
    }
    res.status(200).json({ msg: 'Message sent successfully' });
  });
});

// Reviews Endpoints
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(10);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch reviews', error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, review, userEmail, image } = req.body;

    // Create review with provided name or default to Anonymous
    const newReview = new Review({
      name: name || "Anonymous Visitor",
      rating,
      review,
      userEmail: userEmail || "Guest",
      image: image || null
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ message: "Error saving review" });
  }
});

app.delete('/api/reviews/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    // Check if the logged-in user is the one who wrote the review
    if (review.userEmail !== req.user.email) {
      return res.status(403).json({ msg: 'Forbidden: You can only delete your own reviews' });
    }

    await Review.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Review deleted successfully' });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ msg: 'Failed to delete review', error: err.message });
  }
});

// Register Endpoint
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, contact, userType, age, gender, maritalStatus } = req.body;

    // Validation
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      contactSchema.parse(contact);
    } catch (err) {
      return res.status(400).json({ msg: 'Invalid input data', error: err.errors });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Generate OTP and Hash password
    const otp = generateOTP();
    const hashedPassword = hashPassword(password);

    // Save user with OTP, hashed password, and personal details
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      userType,
      age,
      gender,
      maritalStatus,
      otp
    });
    await newUser.save();

    // Send OTP via Email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Use email from .env
      to: email,
      subject: 'Email Verification OTP',
      text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to send OTP', error: err.message });
      }
      res.status(200).json({ msg: 'User registered. OTP sent to email for verification.' });
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration', error: err.message });
  }
});

// Verify OTP Endpoint
app.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // Mark user as verified and clear OTP
    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ msg: 'OTP verified successfully' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ msg: 'Server error during OTP verification', error: err.message });
  }
});

// Resend OTP Endpoint
app.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the user is already verified
    if (user.verified) {
      return res.status(400).json({ msg: 'User already verified' });
    }

    // Generate a new OTP and update the user
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 3600000); // OTP valid for 1 hour
    await user.save();

    // Send the new OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Use email from .env
      to: email,
      subject: 'Resend OTP - Email Verification',
      text: `Your new OTP is ${otp}. It is valid for 1 hour.`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to send OTP', error: err.message });
      }
      res.status(200).json({ msg: 'OTP resent to email' });
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ msg: 'Server error during resending OTP', error: err.message });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!comparePassword(password, user.password)) {
      return res.status(401).json({ msg: 'Incorrect password' });
    }

    if (!user.verified) {
      return res.status(403).json({ msg: 'Email not verified. Please verify first.' });
    }

    // Generate JWT Token
    const token = jwt.sign({ email: user.email, name: user.name, userType: user.userType }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set token in response headers
    res.setHeader('Authorization', `Bearer ${token}`);


    res.status(200).json({
      msg: 'Login successful',
      token,
      name: user.name,
      isLoggedIn: true,
      userName: user.name,
      userType: user.userType
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login. Please try again later.', error: err.message });
  }
});

// Global Error Handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Profile Endpoints
app.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select('-password -otp -otpExpiry');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching profile', error: err.message });
  }
});

app.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, age, gender, maritalStatus, contact } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $set: {
          name,
          age: Number(age),
          gender,
          maritalStatus,
          contact
        }
      },
      { new: true, runValidators: true }
    ).select('-password -otp -otpExpiry');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Profile update error full stack:', err);
    res.status(500).json({
      msg: 'Server error updating profile',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Protected Route Example
app.get('/protected', verifyToken, (req, res) => {
  res.json({ msg: 'Access granted', user: req.user });
});

// Forgot Password Endpoint
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 3600000); // OTP valid for 1 hour

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via Email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Use email from .env
      to: email,
      subject: 'Password Reset OTP',
      text: `Your password reset OTP is ${otp}. It is valid for 1 hour`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to send OTP', error: err.message });
      }
      res.status(200).json({ msg: 'OTP sent to email for password reset' });
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ msg: 'Server error during forgot password', error: err.message });
  }
});

// Reset Password Endpoint
app.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validation for new password
    try {
      passwordSchema.parse(newPassword);
    } catch (err) {
      return res.status(400).json({ msg: 'Invalid password format', error: err.errors });
    }

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Update password
    user.password = hashPassword(newPassword);
    user.otp = null; // Clear the OTP after use
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ msg: 'Server error during password reset', error: err.message });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
