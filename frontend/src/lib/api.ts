// Em: frontend/src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  // A URL base do seu backend
  baseURL: 'http://localhost:3000', 
});