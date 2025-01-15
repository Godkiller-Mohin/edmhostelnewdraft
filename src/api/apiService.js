import axios from 'axios';
import { getSessionToken, removeSessionAndLogoutUser } from './authentication';

// Create an axios instance with a base URL
const ApiService = axios.create({
  baseURL: 'http://13.211.77.141', // Adjust according to your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add authorization headers if needed
 */
ApiService.interceptors.request.use(
  (config) => {
    if (!config?.noAuth) {
      const token = getSessionToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor to handle successful and error responses
 */
ApiService.interceptors.response.use(
  /**
   * For successful responses, return the data or handle nested response structure
   */
  (response) => {
    if (response?.data) {
      return response.data; // Assuming response structure has .data as the actual result
    }
    return response; // Fallback to returning the whole response if .data is missing
  },

  /**
   * For error responses, handle cases like 401 (Unauthorized) and others
   */
  async (error) => {
    const originalRequest = error.config;

    // Check if the error response has a result_code of 11 or is a 401 (Unauthorized)
    if (error?.response?.data?.result_code === 11 || error.response?.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true; // Avoid retrying infinitely
        removeSessionAndLogoutUser(); // Log the user out if unauthorized
      }
    }

    // Log error for debugging
    console.error('API Error:', error);

    // Return a rejected Promise with error information
    return Promise.reject(error.response?.data || error.message || error);
  }
);

export default ApiService;
