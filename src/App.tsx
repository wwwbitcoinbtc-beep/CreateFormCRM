import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import apiService, { socket } from '@/apiService';
import { theme } from '@/theme';
import { Login } from '@/sections/auth/view';
import MainLayout from '@/layouts/main';

// Define types for our state
interface User {
    id: number;
    username: string;
    // Add other user properties as needed
}

interface AppData {
    users: any[];
    customers: any[];
    tickets: any[];
    // Add other data types as needed
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [data, setData] = useState<AppData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            // If token exists, assume authenticated and try to fetch data
            setIsAuthenticated(true);

            try {
                // Fetch all required data in parallel
                const [users, customers, tickets] = await Promise.all([
                    apiService.getAll('users'),
                    apiService.getAll('customers'),
                    apiService.getAll('tickets'),
                ]);

                setData({ users, customers, tickets });

            } catch (err: any) {
                console.error("Failed to fetch initial data:", err);
                setError(`Failed to load data: ${err.message}. Please try logging in again.`);
                // If token is invalid, log the user out
                apiService.logout();
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated]); // Re-run effect when auth status changes


    const handleLogin = (userData: User) => {
        setUser(userData);
        setIsAuthenticated(true); // This will trigger the useEffect to fetch data
    };

    const handleLogout = () => {
        apiService.logout();
        setUser(null);
        setData(null);
        setIsAuthenticated(false);
    };

    // --- Render logic ---
    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
    }

    if (!isAuthenticated) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Login onLogin={handleLogin} />
            </ThemeProvider>
        );
    }
    
    if (error) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>{error}</p>
                <button onClick={handleLogout}>Go to Login</button>
            </Box>
        );
    }

    if (!data) {
        // This can happen if fetch completes but data is still null
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Could not load app data.</Box>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <MainLayout data={data} onLogout={handleLogout} />
        </ThemeProvider>
    );
}

export default App;
