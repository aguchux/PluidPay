import axios from 'axios';
const WISE_API_BASE = 'https://api.sandbox.transferwise.tech/v1';

export const axiosInstance = axios.create({
  baseURL: WISE_API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer a35b0245-7e27-4843-a603-b3cc4e178808`,
    Accept: 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
