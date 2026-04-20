import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">🅿️ Smart Parking System</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>{getGreeting()}, {user.name}!</p>
        </div>
        <div className="user-info">
          <span className="user-badge">{user.role.toUpperCase()}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="dashboard-grid">
        {user.role === 'driver' && (
          <>
            <Link to="/map" className="dashboard-card">
              <div className="card-icon">🗺️</div>
              <h3 className="card-title">Find Parking</h3>
              <p className="card-description">
                Discover available parking slots in real-time across the city with live updates and instant reservations.
              </p>
            </Link>
            
            <Link to="/reservations" className="dashboard-card">
              <div className="card-icon">🎫</div>
              <h3 className="card-title">My Reservations</h3>
              <p className="card-description">
                View and manage your current and past parking reservations with payment history.
              </p>
            </Link>
            
            <div className="dashboard-card">
              <div className="card-icon">💳</div>
              <h3 className="card-title">Payment History</h3>
              <p className="card-description">
                Track your parking expenses and download receipts for your records.
              </p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">🔔</div>
              <h3 className="card-title">Notifications</h3>
              <p className="card-description">
                Get alerts for parking expiry, payment confirmations, and special offers.
              </p>
            </div>
          </>
        )}

        {user.role === 'operator' && (
          <>
            <div className="dashboard-card">
              <div className="card-icon">🏭</div>
              <h3 className="card-title">Slot Management</h3>
              <p className="card-description">
                Monitor real-time slot occupancy, manage pricing, and control availability across your zones.
              </p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">📊</div>
              <h3 className="card-title">Revenue Dashboard</h3>
              <p className="card-description">
                View daily, weekly, and monthly revenue reports with detailed analytics and trends.
              </p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">📈</div>
              <h3 className="card-title">Usage Analytics</h3>
              <p className="card-description">
                Analyze peak hours, occupancy rates, and customer behavior patterns.
              </p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">⚙️</div>
              <h3 className="card-title">Zone Settings</h3>
              <p className="card-description">
                Configure pricing, operating hours, and special rules for your parking zones.
              </p>
            </div>
          </>
        )}

        {user.role === 'admin' && (
          <>
            <Link to="/admin" className="dashboard-card">
              <div className="card-icon">📈</div>
              <h3 className="card-title">System Analytics</h3>
              <p className="card-description">
                Comprehensive city-wide parking analytics with real-time monitoring and reporting.
              </p>
            </Link>
            
            <div className="dashboard-card">
              <div className="card-icon">👥</div>
              <h3 className="card-title">User Management</h3>
              <p className="card-description">
                Manage drivers, operators, and system administrators with role-based permissions.
              </p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">🏭</div>
              <h3 className="card-title">Zone Management</h3>
              <p className="card-description">
                Add, modify, and monitor parking zones across the city with capacity planning.
              </p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">💰</div>
              <h3 className="card-title">Revenue Overview</h3>
              <p className="card-description">
                City-wide revenue tracking with detailed financial reports and forecasting.
              </p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">🔧</div>
              <h3 className="card-title">System Settings</h3>
              <p className="card-description">
                Configure global system parameters, pricing policies, and operational rules.
              </p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">📊</div>
              <h3 className="card-title">Traffic Analytics</h3>
              <p className="card-description">
                Monitor traffic patterns and parking demand to optimize city planning.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;