import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage on each request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('mhk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('mhk_token');
      localStorage.removeItem('mhk_user');
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// API HELPERS
// ==========================================

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  changePassword: (data: any) => api.put('/auth/change-password', data),
};

export const packageAPI = {
  list: (params?: any) => api.get('/packages', { params }),
  get: (id: string) => api.get(`/packages/${id}`),
  create: (data: any) => api.post('/packages', data),
  update: (id: string, data: any) => api.put(`/packages/${id}`, data),
  delete: (id: string) => api.delete(`/packages/${id}`),
  toggleStatus: (id: string, status: string) =>
    api.patch(`/packages/${id}/status`, { status }),
  stats: () => api.get('/packages/admin/stats'),  // ← Check this exists
};

export const bookingAPI = {
  create: (data: any) => api.post('/bookings', data),
  myBookings: (params?: any) => api.get('/bookings', { params }),
  get: (id: string) => api.get(`/bookings/${id}`),
  cancel: (id: string, reason?: string) =>
    api.put(`/bookings/${id}/cancel`, { reason }),
  delete: (id: string) => api.delete(`/bookings/${id}`),
  allBookings: (params?: any) => api.get('/bookings/admin/all', { params }),
  stats: () => api.get('/bookings/admin/stats'),  // ← Check this exists
  updateStatus: (id: string, status: string) =>
    api.put(`/bookings/admin/${id}/status`, { status }),
};

export const paymentAPI = {
  initiate: (data: any) => api.post('/payments/initiate', data),
  myPayments: (params?: any) => api.get('/payments', { params }),
  get: (id: string) => api.get(`/payments/${id}`),
  verify: (bookingId: string) => api.get(`/payments/verify/${bookingId}`),
  manualConfirm: (data: any) => api.post('/payments/manual-confirm', data),
  stats: () => api.get('/payments/admin/stats'),
  allPayments: (params?: any) => api.get('/payments/admin/all', { params }),  // ← Add this
};

export default api;