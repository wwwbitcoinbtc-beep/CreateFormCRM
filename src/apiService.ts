import io from 'socket.io-client';

// EXPORT the socket so it can be imported by other modules.
export const socket = io({ path: '/socket.io' });

const API_BASE_URL = '/api'; // Use relative path to leverage the Vite proxy

// Helper to get the token from localStorage
const getToken = (): string | null => {
    try {
        return localStorage.getItem('token');
    } catch (e) {
        console.error("Could not access localStorage.");
        return null;
    }
};

// Centralized request function with proper TypeScript types
const request = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { message: await response.text() };
        }
        const error = new Error(errorData.message || `Error fetching from ${endpoint.split('/').pop()}`);
        console.error(`API request to ${endpoint} failed:`, error);
        throw error;
    }

    if (response.status === 204) {
        return null; 
    }

    return response.json();
};


const apiService = {
    // --- Auth ---
    login: (credentials: object) => request('/login', { method: 'POST', body: JSON.stringify(credentials) }),
    logout: () => {
        try {
            localStorage.removeItem('token');
        } catch (e) {
            console.error("Could not access localStorage.");
        }
    },

    // --- Generic CRUD ---
    getAll: (tableName: string) => request(`/${tableName}`),
    create: (tableName: string, data: object) => request(`/${tableName}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (tableName: string, id: number | string, data: object) => request(`/${tableName}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (tableName: string, id: number | string) => request(`/${tableName}/${id}`, { method: 'DELETE' }),
};

export default apiService;
