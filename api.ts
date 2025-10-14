import axios from 'axios';
import cookie from 'js-cookie';

const API_BASE_URL =  process.env.NEXT_PUBLIC_API_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = cookie.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;