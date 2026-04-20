const express = require('express');
const { Payment, Reservation } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Process payment
router.post('/', auth, async (req, res) => {
  try {
    const { reservationId, paymentMethod } = req.body;
    const reservation = await Reservation.findById(reservationId);
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    const payment = new Payment({
      reservationId,
      amount: reservation.amount,
      paymentMethod,
      status: 'completed' // Simplified - would integrate with actual payment gateway
    });
    
    await payment.save();
    res.json({ payment, message: 'Payment processed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;