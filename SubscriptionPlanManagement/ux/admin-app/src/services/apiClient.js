import axios from 'axios';

/**
 * @module apiClient
 * @description Core Axios instance for the entire frontend application.
 * Centralizes base URL, headers, timeouts, and future interceptors
 */
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', 
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 seconds
});

export default apiClient;