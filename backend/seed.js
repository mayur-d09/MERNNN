const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Zone, Slot } = require('./models');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supms');
    
    // Clear existing data
    await User.deleteMany({});
    await Zone.deleteMany({});
    await Slot.deleteMany({});

    // Create users
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const users = await User.insertMany([
      { email: 'driver@test.com', password: hashedPassword, name: 'John Driver', role: 'driver' },
      { email: 'operator@test.com', password: hashedPassword, name: 'Jane Operator', role: 'operator' },
      { email: 'admin@test.com', password: hashedPassword, name: 'Admin User', role: 'admin' }
    ]);

    // Create zones
    const zones = await Zone.insertMany([
      { name: 'Connaught Place', location: { lat: 28.6315, lng: 77.2167 }, totalSlots: 50, pricePerHour: 400 },
      { name: 'Khan Market', location: { lat: 28.5984, lng: 77.2319 }, totalSlots: 30, pricePerHour: 600 },
      { name: 'IGI Airport Terminal', location: { lat: 28.5562, lng: 77.1000 }, totalSlots: 100, pricePerHour: 900 },
      { name: 'Cyber City Gurgaon', location: { lat: 28.4950, lng: 77.0890 }, totalSlots: 75, pricePerHour: 750 }
    ]);

    // Create slots for each zone
    for (const zone of zones) {
      const slots = [];
      for (let i = 1; i <= zone.totalSlots; i++) {
        const statuses = ['available', 'occupied', 'available', 'available']; // 75% available
        slots.push({
          zoneId: zone._id,
          slotNumber: `${zone.name.charAt(0)}${i.toString().padStart(3, '0')}`,
          status: statuses[Math.floor(Math.random() * statuses.length)]
        });
      }
      await Slot.insertMany(slots);
    }

    console.log('Database seeded successfully!');
    console.log('Login credentials:');
    console.log('Driver: driver@test.com / 123456');
    console.log('Operator: operator@test.com / 123456');
    console.log('Admin: admin@test.com / 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();