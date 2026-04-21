import axios from 'axios';
import io from 'socket.io-client';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    try {
      console.log('Making login request to:', `${API_BASE}/auth/login`);
      const response = await api.post('/auth/login', { email, password });
      console.log('Login API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error.response?.data || error.message);
      throw error;
    }
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }
};

export const parkingService = {
  getZones: async () => {
    const response = await api.get('/parking/zones');
    return response.data;
  },
  getSlots: async (zoneId) => {
    const response = await api.get(`/parking/slots/${zoneId}`);
    return response.data;
  },
  reserveSlot: async (slotId, duration) => {
    const response = await api.post('/parking/reserve', { slotId, duration });
    return response.data;
  },
  releaseSlot: async (slotId) => {
    const response = await api.post('/parking/release', { slotId });
    return response.data;
  }
};

export const paymentService = {
  processPayment: async (reservationId, paymentMethod) => {
    const response = await api.post('/payment', { reservationId, paymentMethod });
    return response.data;
  }
};

export const socketService = {
  connect: () => io(process.env.REACT_APP_API_URL || 'http://localhost:5000'),
  joinZone: (socket, zoneId) => socket.emit('join-zone', zoneId)
};