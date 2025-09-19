// This is a placeholder for your Node.js server backend.
// This file will NOT run in the current Firebase Studio environment.
// You can use this as a starting point for your local development.

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const knex = require('knex');
const knexConfig = require('./knexfile');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Initialize Knex
const db = knex(knexConfig.development);

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('<h1>CRM Backend Server</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on *:${PORT}`);
  // You can test the database connection here if you want
  db.raw('SELECT 1').then(() => {
    console.log('SQL Server connected successfully.');
  }).catch((e) => {
    console.error('Failed to connect to SQL Server.');
    console.error(e);
  });
});
