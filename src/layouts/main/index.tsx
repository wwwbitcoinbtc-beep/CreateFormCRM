import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// A simple layout for the main dashboard
const MainLayout = ({ data, onLogout }) => {
  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="contained" color="secondary" onClick={onLogout}>
          Logout
        </Button>
      </Box>
      <Typography sx={{ mt: 2 }}>Welcome! You have successfully logged in.</Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Data from Server:</Typography>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Box>
    </Box>
  );
};

export default MainLayout;
