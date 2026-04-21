import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { parkingService } from '../services/api';
import { Link } from 'react-router-dom';

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      // For demo purposes, we'll simulate reservations
      // In a real app, you'd have an API endpoint for user reservations
      const mockReservations = [
        {
          _id: '1',
          zoneName: 'Downtown Mall',
          slotNumber: 'D001',
          startTime: new Date().toISOString(),
          duration: 2,
          amount: 10,
          status: 'active'
        },
        {
          _id: '2',
          zoneName: 'City Center',
          slotNumber: 'C015',
          startTime: new Date(Date.now() - 86400000).toISOString(),
          duration: 1,
          amount: 8,
          status: 'completed'
        }
      ];
      setReservations(mockReservations);
      setLoading(false);
    } catch (error) {
      console.error('Error loading reservations:', error);
      setLoading(false);
    }
  };

  const handleRelease = async (reservationId) => {
    try {
      // In a real app, you'd call the release API
      alert('Slot released successfully!');
      loadReservations();
    } catch (error) {
      alert('Error releasing slot: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading reservations...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">🎫 My Reservations</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>Manage your parking reservations</p>
        </div>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#667eea', fontWeight: '600' }}>
          ← Back to Dashboard
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          padding: '50px', 
          borderRadius: '15px', 
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚗</div>
          <h3>No Reservations Yet</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            You haven't made any parking reservations yet.
          </p>
          <Link to="/map" className="btn-primary" style={{ 
            display: 'inline-block', 
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '8px'
          }}>
            Find Parking Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {reservations.map(reservation => (
            <div key={reservation._id} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '25px',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: reservation.status === 'active' ? '2px solid #2ed573' : '2px solid #e1e5e9'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#333' }}>{reservation.zoneName}</h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: reservation.status === 'active' ? '#2ed573' : '#6c757d',
                      color: 'white'
                    }}>
                      {reservation.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', fontSize: '14px', color: '#666' }}>
                    <div><strong>Slot:</strong> {reservation.slotNumber}</div>
                    <div><strong>Duration:</strong> {reservation.duration} hour(s)</div>
                    <div><strong>Amount:</strong> ₹{reservation.amount}</div>
                    <div><strong>Start Time:</strong> {new Date(reservation.startTime).toLocaleString()}</div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  {reservation.status === 'active' && (
                    <button
                      onClick={() => handleRelease(reservation._id)}
                      style={{
                        background: '#ff4757',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Release Slot
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;