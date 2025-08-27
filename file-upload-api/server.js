require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path'); // For serving static files

const User = require('./models/User');
const authMiddleware = require('./middleware/auth');
const uploadMiddleware = require('./middleware/upload');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware to parse JSON in the request body
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Database connection error:', err);
});

// --- USER AUTHENTICATION ROUTES ---

// POST /api/users/register
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'Username already exists or invalid data.' });
  }
});

// POST /api/users/login
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const payload = { userId: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// --- PROFILE PICTURE UPLOAD ROUTE ---

// POST /api/users/profile-picture
app.post('/api/users/profile-picture', authMiddleware, uploadMiddleware.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const user = await User.findByIdAndUpdate(
      req.userData.userId,
      { profilePicture: `/uploads/${req.file.filename}` },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      message: 'Profile picture uploaded successfully!',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    if (error.message === 'Invalid file type, only images are allowed.') {
      return res.status(400).json({ error: error.message });
    }
    console.error('File upload failed:', error);
    res.status(500).json({ error: 'File upload failed.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});