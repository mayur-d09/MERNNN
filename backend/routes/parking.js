const express = require('express');
const { Zone, Slot, Reservation } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Demo data
const demoZones = [
  {
    _id: 'zone1',
    name: 'Downtown Central',
    location: { lat: 28.6139, lng: 77.2090 },
    totalSlots: 10,
    pricePerHour: 50
  },
  {
    _id: 'zone2',
    name: 'Mall Parking',
    location: { lat: 28.6129, lng: 77.2300 },
    totalSlots: 15,
    pricePerHour: 40
  },
  {
    _id: 'zone3',
    name: 'Airport Zone',
    location: { lat: 28.5562, lng: 77.1000 },
    totalSlots: 20,
    pricePerHour: 80
  }
];

const demoSlots = {
  zone1: [
    { _id: 's1', zoneId: 'zone1', slotNumber: 'A1', status: 'available' },
    { _id: 's2', zoneId: 'zone1', slotNumber: 'A2', status: 'occupied' },
    { _id: 's3', zoneId: 'zone1', slotNumber: 'A3', status: 'available' },
    { _id: 's4', zoneId: 'zone1', slotNumber: 'A4', status: 'reserved' },
    { _id: 's5', zoneId: 'zone1', slotNumber: 'A5', status: 'available' },
    { _id: 's6', zoneId: 'zone1', slotNumber: 'A6', status: 'available' },
    { _id: 's7', zoneId: 'zone1', slotNumber: 'A7', status: 'occupied' },
    { _id: 's8', zoneId: 'zone1', slotNumber: 'A8', status: 'available' },
    { _id: 's9', zoneId: 'zone1', slotNumber: 'A9', status: 'available' },
    { _id: 's10', zoneId: 'zone1', slotNumber: 'A10', status: 'available' }
  ],
  zone2: [
    { _id: 's11', zoneId: 'zone2', slotNumber: 'B1', status: 'available' },
    { _id: 's12', zoneId: 'zone2', slotNumber: 'B2', status: 'occupied' },
    { _id: 's13', zoneId: 'zone2', slotNumber: 'B3', status: 'available' },
    { _id: 's14', zoneId: 'zone2', slotNumber: 'B4', status: 'available' },
    { _id: 's15', zoneId: 'zone2', slotNumber: 'B5', status: 'reserved' },
    { _id: 's16', zoneId: 'zone2', slotNumber: 'B6', status: 'available' },
    { _id: 's17', zoneId: 'zone2', slotNumber: 'B7', status: 'occupied' },
    { _id: 's18', zoneId: 'zone2', slotNumber: 'B8', status: 'available' },
    { _id: 's19', zoneId: 'zone2', slotNumber: 'B9', status: 'available' },
    { _id: 's20', zoneId: 'zone2', slotNumber: 'B10', status: 'available' },
    { _id: 's21', zoneId: 'zone2', slotNumber: 'B11', status: 'available' },
    { _id: 's22', zoneId: 'zone2', slotNumber: 'B12', status: 'available' },
    { _id: 's23', zoneId: 'zone2', slotNumber: 'B13', status: 'available' },
    { _id: 's24', zoneId: 'zone2', slotNumber: 'B14', status: 'available' },
    { _id: 's25', zoneId: 'zone2', slotNumber: 'B15', status: 'available' }
  ],
  zone3: [
    { _id: 's30', zoneId: 'zone3', slotNumber: 'C01', status: 'available' },
    { _id: 's31', zoneId: 'zone3', slotNumber: 'C02', status: 'occupied' },
    { _id: 's32', zoneId: 'zone3', slotNumber: 'C03', status: 'available' },
    { _id: 's33', zoneId: 'zone3', slotNumber: 'C04', status: 'available' },
    { _id: 's34', zoneId: 'zone3', slotNumber: 'C05', status: 'reserved' },
    { _id: 's35', zoneId: 'zone3', slotNumber: 'C06', status: 'available' },
    { _id: 's36', zoneId: 'zone3', slotNumber: 'C07', status: 'occupied' },
    { _id: 's37', zoneId: 'zone3', slotNumber: 'C08', status: 'available' },
    { _id: 's38', zoneId: 'zone3', slotNumber: 'C09', status: 'available' },
    { _id: 's39', zoneId: 'zone3', slotNumber: 'C10', status: 'available' },
    { _id: 's40', zoneId: 'zone3', slotNumber: 'C11', status: 'available' },
    { _id: 's41', zoneId: 'zone3', slotNumber: 'C12', status: 'occupied' },
    { _id: 's42', zoneId: 'zone3', slotNumber: 'C13', status: 'available' },
    { _id: 's43', zoneId: 'zone3', slotNumber: 'C14', status: 'available' },
    { _id: 's44', zoneId: 'zone3', slotNumber: 'C15', status: 'reserved' },
    { _id: 's45', zoneId: 'zone3', slotNumber: 'C16', status: 'available' },
    { _id: 's46', zoneId: 'zone3', slotNumber: 'C17', status: 'occupied' },
    { _id: 's47', zoneId: 'zone3', slotNumber: 'C18', status: 'available' },
    { _id: 's48', zoneId: 'zone3', slotNumber: 'C19', status: 'available' },
    { _id: 's49', zoneId: 'zone3', slotNumber: 'C20', status: 'available' }
  ]
};

// Get parking zones
router.get('/zones', async (req, res) => {
  try {
    const zones = await Zone.find();
    if (zones.length > 0) {
      res.json(zones);
    } else {
      res.json(demoZones);
    }
  } catch (error) {
    console.log('DB error, using demo zones');
    res.json(demoZones);
  }
});

// Get slots for a zone
router.get('/slots/:zoneId', async (req, res) => {
  try {
    const slots = await Slot.find({ zoneId: req.params.zoneId });
    if (slots.length > 0) {
      res.json(slots);
    } else {
      const demoSlotList = demoSlots[req.params.zoneId] || [];
      res.json(demoSlotList);
    }
  } catch (error) {
    console.log('DB error, using demo slots for', req.params.zoneId);
    const demoSlotList = demoSlots[req.params.zoneId] || [];
    res.json(demoSlotList);
  }
});

// Reserve a slot
router.post('/reserve', auth, async (req, res) => {
  try {
    const { slotId, duration } = req.body;
    const slot = await Slot.findById(slotId);
    
    if (!slot || slot.status !== 'available') {
      return res.status(400).json({ error: 'Slot not available' });
    }
    
    const endTime = new Date(Date.now() + duration * 60 * 60 * 1000);
    const zone = await Zone.findById(slot.zoneId);
    const amount = duration * zone.pricePerHour;
    
    // Update slot status
    slot.status = 'reserved';
    slot.reservedBy = req.user.userId;
    slot.reservedUntil = endTime;
    await slot.save();
    
    // Create reservation
    const reservation = new Reservation({
      userId: req.user.userId,
      slotId,
      endTime,
      amount
    });
    await reservation.save();
    
    // Emit real-time update
    req.app.get('io').to(`zone-${slot.zoneId}`).emit('slot-update', { slotId, status: 'reserved' });
    
    res.json({ reservation, amount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Release slot
router.post('/release', auth, async (req, res) => {
  try {
    const { slotId } = req.body;
    const slot = await Slot.findById(slotId);
    
    slot.status = 'available';
    slot.reservedBy = null;
    slot.reservedUntil = null;
    await slot.save();
    
    // Update reservation
    await Reservation.findOneAndUpdate(
      { slotId, userId: req.user.userId, status: 'active' },
      { status: 'completed', endTime: new Date() }
    );
    
    // Emit real-time update
    req.app.get('io').to(`zone-${slot.zoneId}`).emit('slot-update', { slotId, status: 'available' });
    
    res.json({ message: 'Slot released successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;