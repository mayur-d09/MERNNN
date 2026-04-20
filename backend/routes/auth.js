const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// Demo in-memory users (fallback when no DB) - accepts ANY password
const demoUsers = {
  'driver@test.com': {
    id: 'demo_driver',
    name: 'Demo Driver',
    role: 'driver'
  },
  'admin@test.com': {
    id: 'demo_admin',
    name: 'Demo Admin',
    role: 'admin'
  }
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ email, password: hashedPassword, name, role });
    await user.save();
    
    const token = jwt.sign({ userId: user._id, role: user.role }, 'secret');
    res.json({ token, user: { id: user._id, email, name, role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    let user;
    try {
      user = await User.findOne({ email });
    } catch (dbError) {
      console.log('DB unavailable, using demo user:', email);
      user = null; // Force fallback
    }
    
    // DB fallback to demo users - ANY password works
    if (!user && demoUsers[email]) {
      const demoUser = demoUsers[email];
      // Bypass password check for demo - always accept
      const token = jwt.sign(
        { userId: demoUser.id, role: demoUser.role }, 
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
      return res.json({ 
        token, 
        user: { 
          id: demoUser.id, 
          email: email,
          name: demoUser.name, 
          role: demoUser.role 
        } 
      });
    }
    
    // Normal DB auth
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { userId: user._id, role: user.role }, 
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
      
      res.json({ 
        token, 
        user: { 
          id: user._id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        } 
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
