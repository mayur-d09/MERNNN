import React from 'react';

function SlotStatus({ slots }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'slot-available';
      case 'occupied': return 'slot-occupied';
      case 'reserved': return 'slot-reserved';
      default: return 'slot-available';
    }
  };

  const statusCounts = slots.reduce((acc, slot) => {
    acc[slot.status] = (acc[slot.status] || 0) + 1;
    return acc;
  }, {});

  if (slots.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
        <p>Loading slot information...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="status-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#2ed573' }}></div>
          <span>Available ({statusCounts.available || 0})</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ffa502' }}></div>
          <span>Reserved ({statusCounts.reserved || 0})</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff4757' }}></div>
          <span>Occupied ({statusCounts.occupied || 0})</span>
        </div>
      </div>

      <div className="slots-grid">
        {slots.map(slot => (
          <div
            key={slot._id}
            className={`slot-item ${getStatusColor(slot.status)}`}
            title={`Slot ${slot.slotNumber} - ${slot.status.toUpperCase()}`}
          >
            {slot.slotNumber}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
        Total Slots: {slots.length} | 
        Occupancy Rate: {slots.length > 0 ? Math.round(((slots.length - (statusCounts.available || 0)) / slots.length) * 100) : 0}%
      </div>
    </div>
  );
}

export default SlotStatus;