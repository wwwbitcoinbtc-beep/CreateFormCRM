import io from 'socket.io-client';

// Use a relative path for the socket connection.
// Vite's proxy will automatically forward this to the correct backend server (ws://localhost:3001)
// This avoids CORS and mixed content issues.
const socket = io({ path: '/socket.io' });

const API_BASE_URL = '/api'; // Use relative path to leverage the Vite proxy

// Helper to get the token from localStorage
const getToken = () => {
    try {
        const token = localStorage.getItem('token');
        return token;
    } catch (e) {
        console.error("Could not access localStorage.");
        return null;
    }
};

// Centralized request function
const request = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // The fetch URL will be relative, like '/api/users'
    // Vite dev server will proxy this to http://localhost:3001/users
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorData;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            errorData = await response.json();
        } else {
            errorData = { message: await response.text() };
        }
        const error = new Error(errorData.message || `Error fetching from ${endpoint.split('/').pop()}`);
        console.error(`API request to ${endpoint} failed:`, error);
        throw error;
    }

    // Handle 204 No Content response
    if (response.status === 204) {
        return null; 
    }

    return response.json();
};


const apiService = {
    // --- Real-time listeners ---
    on: (event, callback) => {
        console.log(`Socket: Registering listener for '${event}'`);
        socket.on(event, callback);
    },
    off: (event, callback) => {
        console.log(`Socket: Unregistering listener for '${event}'`);
        socket.off(event, callback);
    },

    // --- Auth ---
    login: (credentials) => request('/login', { method: 'POST', body: JSON.stringify(credentials) }),

    // --- Generic CRUD ---
    getAll: (tableName) => request(`/${tableName}`),
    create: (tableName, data) => request(`/${tableName}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (tableName, id, data) => request(`/${tableName}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (tableName, id) => request(`/${tableName}/${id}`, { method: 'DELETE' }),
};

export default apiService;
