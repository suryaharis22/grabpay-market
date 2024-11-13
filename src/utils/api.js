// utils/api.js
import axios from 'axios';

// Create an axios instance with basic configuration
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Replace with your API's base URL
    timeout: 10000, // Timeout of 10 seconds
});

// Add interceptor to include token in request headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// Function for GET request
export const getData = async (endpoint) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function for POST request with FormData support
export const postData = async (endpoint, data) => {
    try {
        const headers = data instanceof FormData
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' };

        const response = await api.post(endpoint, data, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function for PUT request with FormData support
export const putData = async (endpoint, data) => {
    try {
        const headers = data instanceof FormData
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' };

        const response = await api.put(endpoint, data, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function for DELETE request
export const deleteData = async (endpoint) => {
    try {
        const response = await api.delete(endpoint);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
