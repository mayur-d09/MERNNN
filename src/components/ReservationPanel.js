import React, { useState } from 'react';
import { parkingService, paymentService } from '../services/api';

function ReservationPanel({ selectedZone, slots, onReservation }) {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const availableSlots = slots.filter(slot => slot.status === 'available');
  const totalAmount = duration * selectedZone.pricePerHour;

  const handleReservation = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Please select a slot first!');
      return;
    }

    setLoading(true);
    try {
      console.log('Making reservation request...', { selectedSlot, duration });
      const reservationData = await parkingService.reserveSlot(selectedSlot, duration);
      console.log('Reservation successful:', reservationData);
      setReservation(reservationData);
      onReservation(selectedZone._id);
    } catch (error) {
      console.error('Reservation error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Network error - make sure backend is running';
      alert('Reservation failed: ' + errorMessage);
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      console.log('Processing payment...', reservation.reservation._id);
      await paymentService.processPayment(reservation.reservation._id, 'credit_card');
      console.log('Payment successful!');
      alert('✅ Payment successful! Your parking slot is confirmed.');
      setReservation(null);
      setSelectedSlot('');
      setDuration(1);
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Network error - make sure backend is running';
      alert('Payment failed: ' + errorMessage);
    }
    setPaymentLoading(false);
  };

  if (reservation) {
    const selectedSlotInfo = slots.find(s => s._id === selectedSlot);
    return (
      <div className="reservation-panel">
        <h4 style={{ color: '#2ed573', marginBottom: '20px' }}>
          ✅ Reservation Confirmed!
        </h4>
        
        <div style={{ background: 'rgba(46, 213, 115, 0.1)', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div><strong>Zone:</strong> {selectedZone.name}</div>
            <div><strong>Slot:</strong> {selectedSlotInfo?.slotNumber}</div>
            <div><strong>Duration:</strong> {duration} hour(s)</div>
            <div><strong>Rate:</strong> ₹{selectedZone.pricePerHour}/hour</div>
            <div style={{ fontSize: '18px', color: '#2ed573' }}>
              <strong>Total Amount: ₹{reservation.amount}</strong>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handlePayment}
          disabled={paymentLoading}
          className="btn-pay"
          style={{
            background: paymentLoading ? '#ccc' : 'linear-gradient(135deg, #ffa502 0%, #ff6348 100%)',
            cursor: paymentLoading ? 'not-allowed' : 'pointer',
            opacity: paymentLoading ? 0.7 : 1
          }}
        >
          {paymentLoading ? 'Processing Payment...' : `💳 Pay ₹${reservation.amount} Now`}
        </button>
        
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
          Secure payment powered by SUPMS
        </p>
      </div>
    );
  }

  return (
    <div className="reservation-panel">
      <h4 style={{ marginBottom: '20px', color: '#333' }}>
        🎫 Reserve Parking Slot
      </h4>
      
      {availableSlots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🙅‍♂️</div>
          <h4>No Available Slots</h4>
          <p>All slots in this zone are currently occupied or reserved.</p>
        </div>
      ) : (
        <form onSubmit={handleReservation} className="reservation-form">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Select Slot:
            </label>
            <select 
              value={selectedSlot} 
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Choose an available slot</option>
              {availableSlots.map(slot => (
                <option key={slot._id} value={slot._id}>
                  Slot {slot.slotNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Duration (hours):
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="form-input"
              required
            />
          </div>

          <div className="amount-display">
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>Total Amount</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>₹{totalAmount}</div>
            <div style={{ fontSize: '12px', opacity: '0.8' }}>
              ₹{selectedZone.pricePerHour}/hour × {duration} hour(s)
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!selectedSlot || loading}
            className="btn-reserve"
          >
            {loading ? 'Reserving Slot...' : '🎯 Reserve Slot'}
          </button>
        </form>
      )}
    </div>
  );
}

export default ReservationPanel;