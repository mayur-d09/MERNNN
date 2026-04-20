const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['driver', 'operator', 'admin'], default: 'driver' },
  name: { type: String, required: true }
}, { timestamps: true });

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { lat: Number, lng: Number },
  totalSlots: { type: Number, required: true },
  pricePerHour: { type: Number, required: true }
});

const slotSchema = new mongoose.Schema({
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
  slotNumber: { type: String, required: true },
  status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' },
  reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reservedUntil: Date
});

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  amount: Number
}, { timestamps: true });

const paymentSchema = new mongoose.Schema({
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentMethod: String
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Zone: mongoose.model('Zone', zoneSchema),
  Slot: mongoose.model('Slot', slotSchema),
  Reservation: mongoose.model('Reservation', reservationSchema),
  Payment: mongoose.model('Payment', paymentSchema)
};