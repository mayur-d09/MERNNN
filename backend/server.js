const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket config
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 🔥 DEMO ROUTE (IMPORTANT FOR RENDER CHECK)
app.get("/", (req, res) => {
  res.send("Smart Parking Backend is LIVE 🚀");
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB (safe fallback if not connected)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supms')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB not connected (demo mode)'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parking', require('./routes/parking'));
app.use('/api/payment', require('./routes/payment'));

// 🔥 Try serving frontend ONLY if build exists
const buildPath = path.join(__dirname, '../frontend/build');

app.use(express.static(buildPath));

app.get("*", (req, res) => {
  if (require('fs').existsSync(buildPath)) {
    res.sendFile(path.join(buildPath, 'index.html'));
  } else {
    res.send("Frontend not built. Backend is running 🚀");
  }
});

// Socket events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-zone', (zoneId) => {
    socket.join(`zone-${zoneId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.set('io', io);

// PORT FIX (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
