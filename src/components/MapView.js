import React, { useState, useEffect } from 'react';
import { parkingService, socketService } from '../services/api';
import SlotStatus from './SlotStatus';
import ReservationPanel from './ReservationPanel';
import { Link } from 'react-router-dom';

function MapView() {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [slots, setSlots] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadZones();
    const newSocket = socketService.connect();
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (selectedZone && socket) {
      loadSlots(selectedZone._id);
      socketService.joinZone(socket, selectedZone._id);

      socket.on('slot-update', (update) => {
        setSlots(prev => prev.map(slot => 
          slot._id === update.slotId ? { ...slot, status: update.status } : slot
        ));
      });
    }
  }, [selectedZone, socket]);

  const loadZones = async () => {
    try {
      const data = await parkingService.getZones();
      setZones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading zones:', error);
      setZones([]); // Show empty list instead of stuck loading
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async (zoneId) => {
    try {
      const data = await parkingService.getSlots(zoneId);
      setSlots(data);
    } catch (error) {
      console.error('Error loading slots:', error);
    }
  };

  if (loading) {
    return (
      <div className="map-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading parking zones...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, color: '#333' }}>🗺️ Parking Map</h2>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>Find and reserve parking slots in real-time</p>
          </div>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#667eea', fontWeight: '600' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="map-grid">
        <div className="zones-panel">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>🏭 Parking Zones</h3>
          {zones.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
              No parking zones available
            </p>
          ) : (
            zones.map(zone => {
              const availableSlots = slots.filter(s => s.status === 'available').length;
              const occupancyRate = slots.length > 0 ? Math.round(((slots.length - availableSlots) / slots.length) * 100) : 0;
              
              return (
                <div
                  key={zone._id}
                  onClick={() => setSelectedZone(zone)}
                  className={`zone-card ${selectedZone?._id === zone._id ? 'selected' : ''}`}
                >
                  <div className="zone-name">{zone.name}</div>
                  <div className="zone-info">
                    <div><strong>Total Slots:</strong> {zone.totalSlots}</div>
                    <div><strong>Price:</strong> ₹{zone.pricePerHour}/hr</div>
                    {selectedZone?._id === zone._id && (
                      <>
                        <div><strong>Available:</strong> {availableSlots}</div>
                        <div><strong>Occupancy:</strong> {occupancyRate}%</div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="slots-panel">
          {selectedZone ? (
            <>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>
                🎯 {selectedZone.name} - Live Status
              </h3>
              <SlotStatus slots={slots} />
              <ReservationPanel 
                selectedZone={selectedZone} 
                slots={slots} 
                onReservation={loadSlots} 
              />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
              <h3>Select a Parking Zone</h3>
              <p>Choose a zone from the left panel to view available slots and make reservations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapView;