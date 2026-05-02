import axios from 'axios';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL
).replace(/\/+$/, '');

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;
