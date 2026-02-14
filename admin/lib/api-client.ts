import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

apiClient.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('auth_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/admin/auth/login', { email, password }).then((r) => r.data),
  logout: () => apiClient.post('/admin/auth/logout').then((r) => r.data),
  getProfile: () => apiClient.get('/admin/auth/profile').then((r) => r.data),
};

export const uploadAPI = {
  upload: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return apiClient
      .post('/common/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
};

const GARAGE_API_URL = process.env.NEXT_PUBLIC_GARAGE_API_URL || 'http://localhost:5000/api';

const garageClient = axios.create({
  baseURL: GARAGE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

garageClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

garageClient.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('auth_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export const garageAPI = {
  getAll: () => garageClient.get('/garage').then((r) => r.data),
  getGarage: (id: string) => garageClient.get(`/garage/${id}`).then((r) => r.data),
  getOverviewStats: () => garageClient.get('/garage/stats/overview').then((r) => r.data),
  editGarage: (id: string, data: any) => garageClient.patch(`/garage/${id}`, data).then((r) => r.data),
  createGarage: (data: any) => garageClient.post('/garage', data).then((r) => r.data),
  deleteGarage: (id: string) => garageClient.delete(`/garage/${id}`).then((r) => r.data),
  createSubscription: (garageId: string, data: { planName: string; startDate?: string }) =>
    garageClient.post(`/garage/${garageId}/subscription`, data).then((r) => r.data),
  getAllSubscriptions: () =>
    garageClient.get('/garage/subscriptions').then((r) => r.data),
  getAdmins: () => garageClient.get('/admin').then((r) => r.data),
  createAdmin: (data: any) => garageClient.post('/admin', data).then((r) => r.data),
  updateAdmin: (id: string, data: any) => garageClient.put(`/admin/${id}`, data).then((r) => r.data),
  deleteAdmin: (id: string) => garageClient.delete(`/admin/${id}`).then((r) => r.data),
  getSubscriptionPlans: () => garageClient.get('/subscription-plans').then((r) => r.data),
  createSubscriptionPlan: (data: any) => garageClient.post('/subscription-plans', data).then((r) => r.data),
  updateSubscriptionPlan: (id: string, data: any) => garageClient.put(`/subscription-plans/${id}`, data).then((r) => r.data),
  deleteSubscriptionPlan: (id: string) => garageClient.patch(`/subscription-plans/${id}`).then((r) => r.data),
};



export default apiClient;
