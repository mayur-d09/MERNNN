import React, { useState, useEffect } from 'react';
import { parkingService } from '../services/api';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [zones, setZones] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalSlots: 0,
    occupiedSlots: 0,
    reservedSlots: 0,
    availableSlots: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const zonesData = await parkingService.getZones();
      setZones(zonesData);

      // Calculate analytics
      let totalSlots = 0, occupiedSlots = 0, reservedSlots = 0, availableSlots = 0;

      for (const zone of zonesData) {
        const slots = await parkingService.getSlots(zone._id);
        totalSlots += slots.length;
        occupiedSlots += slots.filter(s => s.status === 'occupied').length;
        reservedSlots += slots.filter(s => s.status === 'reserved').length;
        availableSlots += slots.filter(s => s.status === 'available').length;
      }

      // Simulate additional metrics
      const totalRevenue = Math.round((occupiedSlots + reservedSlots) * 8.5 * 100) / 100;
      const activeUsers = Math.round(totalSlots * 0.15);

      setAnalytics({ 
        totalSlots, 
        occupiedSlots, 
        reservedSlots, 
        availableSlots,
        totalRevenue,
        activeUsers
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading admin dashboard...</h2>
        </div>
      </div>
    );
  }

  const occupancyRate = analytics.totalSlots > 0 
    ? Math.round(((analytics.occupiedSlots + analytics.reservedSlots) / analytics.totalSlots) * 100)
    : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">📈 Admin Dashboard</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>City-wide parking management and analytics</p>
        </div>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#667eea', fontWeight: '600' }}>
          ← Back to Dashboard
        </Link>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number stat-total">{analytics.totalSlots}</div>
          <div className="stat-label">Total Parking Slots</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number stat-available">{analytics.availableSlots}</div>
          <div className="stat-label">Available Slots</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number stat-reserved">{analytics.reservedSlots}</div>
          <div className="stat-label">Reserved Slots</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number stat-occupied">{analytics.occupiedSlots}</div>
          <div className="stat-label">Occupied Slots</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#667eea' }}>{occupancyRate}%</div>
          <div className="stat-label">Occupancy Rate</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#2ed573' }}>₹{analytics.totalRevenue}</div>
          <div className="stat-label">Today's Revenue</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#ffa502' }}>{analytics.activeUsers}</div>
          <div className="stat-label">Active Users</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#ff4757' }}>{zones.length}</div>
          <div className="stat-label">Parking Zones</div>
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ marginBottom: '25px', color: '#333' }}>🏭 Parking Zones Overview</h3>
        
        {zones.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No parking zones configured
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {zones.map(zone => {
              // Calculate zone-specific stats (simulated)
              const zoneOccupancy = Math.round(Math.random() * 100);
              const zoneRevenue = Math.round(zone.pricePerHour * zone.totalSlots * 0.6 * 100) / 100;
              
              return (
                <div key={zone._id} style={{ 
                  padding: '20px', 
                  border: '2px solid #e1e5e9', 
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: '#333', marginBottom: '10px', fontSize: '20px' }}>{zone.name}</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', fontSize: '14px', color: '#666' }}>
                        <div><strong>Total Slots:</strong> {zone.totalSlots}</div>
                        <div><strong>Price:</strong> ₹{zone.pricePerHour}/hour</div>
                        <div><strong>Location:</strong> {zone.location?.lat?.toFixed(4)}, {zone.location?.lng?.toFixed(4)}</div>
                        <div><strong>Occupancy:</strong> {zoneOccupancy}%</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#2ed573', marginBottom: '5px' }}>
                        ₹{zoneRevenue}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Today's Revenue</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;