import { io, Socket } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:3001/api';

// --- Socket.io Client ---
export const socket: Socket = io('http://localhost:3001');

socket.on('connect', () => {
    console.log('Connected to Socket.io server!');
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.io server.');
});


// --- Helper functions for localStorage ---
export const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

export const getUser = (): any | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};


// --- Core API Request Function ---
const request = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`API request to ${endpoint} failed:`, error);
        throw error;
    }
};

// --- Authentication ---
export const login = async (credentials: any) => {
    try {
        // Login does not use the generic 'request' function as it sets the token
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Invalid credentials');
        }

        const { token, user } = await response.json();
        
        if (token && user) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { token, user };
        } else {
            throw new Error('Login response did not contain token or user.');
        }

    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};


// --- Generic CRUD methods ---
const apiService = {
    getAll: (resource: string) => request(`/${resource}`),
    get: (resource: string, id: string) => request(`/${resource}/${id}`),
    create: (resource: string, data: any) => request(`/${resource}`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (resource: string, id: string, data: any) => request(`/${resource}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (resource: string, id: string) => request(`/${resource}/${id}`, {
        method: 'DELETE',
    }),
    deleteMany: (resource: string, ids: string[]) => request(`/${resource}/delete-many`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
    }),
};

export default apiService;
