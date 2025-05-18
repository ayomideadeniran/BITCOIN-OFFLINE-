// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Change if your backend is hosted elsewhere
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
