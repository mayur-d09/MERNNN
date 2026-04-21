const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// API Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/parking', require('./backend/routes/parking'));
app.use('/api/payment', require('./backend/routes/payment'));

// Serve React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 MERN Parking App running on port ${PORT}`);
});

