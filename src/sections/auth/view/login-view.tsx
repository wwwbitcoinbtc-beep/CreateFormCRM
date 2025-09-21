import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import apiService from '@/apiService';

export function LoginView({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { user, token } = await apiService.login({ username, password });
      // Assuming the login response now includes the token
      if (token) {
          localStorage.setItem('token', token);
      }
      onLogin(user);
    } catch (err) {
      setError('Invalid username or password');
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        height: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 420,
        }}
      >
        <Typography variant="h4">Sign in</Typography>

        <Stack spacing={3} sx={{ mt: 3 }}>
          <TextField 
            name="username" 
            label="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Stack>

        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={handleLogin}
          sx={{ mt: 3 }}
        >
          Login
        </Button>
      </Card>
    </Box>
  );
}
