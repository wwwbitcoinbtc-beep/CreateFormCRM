// This is a placeholder for your Node.js server backend.
// This file will NOT run in the current Firebase Studio environment.
// You can use this as a starting point for your local development.

const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile');

const app = express();
const db = knex(knexConfig.development);

const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());


// API Routes
app.get('/', (req, res) => {
  res.send('<h1>CRM Backend Server is running</h1>');
});

// --- Users API ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await db('users').select('*');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// --- Customers API ---
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await db('customers').select('*');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err });
  }
});

// --- Purchase Contracts API ---
app.get('/api/purchase-contracts', async (req, res) => {
  try {
    const contracts = await db('purchase_contracts').select('*');
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching purchase contracts', error: err });
  }
});

// --- Support Contracts API ---
app.get('/api/support-contracts', async (req, res) => {
  try {
    const contracts = await db('support_contracts').select('*');
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching support contracts', error: err });
  }
});

// --- Tickets API ---
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await db('tickets').select('*');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets', error: err });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on *:${PORT}`);
  db.raw('SELECT 1').then(() => {
    console.log('SQL Server connected successfully.');
  }).catch((e) => {
    console.error('Failed to connect to SQL Server.');
    console.error(e);
  });
});