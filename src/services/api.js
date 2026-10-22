import axios from 'axios';

export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE !== 'false';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(config => {
  const stored = localStorage.getItem('cpt_user');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch { localStorage.removeItem('cpt_user'); }
  }
  return config;
});

export const request = (config, mockHandler) => MOCK_MODE
  ? Promise.resolve().then(mockHandler)
  : api.request(config).then(response => response.data);

export default api;
