import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';
import knexConfig from './knexfile.js';

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

// --- Referrals API ---
app.get('/api/referrals', async (req, res) => {
  try {
    const referrals = await db('referrals')
      .join('tickets', 'referrals.ticket_id', '=', 'tickets.id')
      .select(
        'referrals.id as id',
        'referrals.referredBy',
        'referrals.referredTo',
        'referrals.referralDate',
        'tickets.id as ticket_id',
        'tickets.ticketNumber',
        'tickets.title',
        'tickets.description',
        'tickets.customerId',
        'tickets.creationDateTime',
        'tickets.lastUpdateDate',
        'tickets.status',
        'tickets.priority',
        'tickets.type',
        'tickets.channel',
        'tickets.assignedTo',
        'tickets.attachments',
        'tickets.editableUntil',
        'tickets.workSessionStartedAt',
        'tickets.totalWorkDuration'
      );

    const result = referrals.map(r => ({
      id: r.id,
      referredBy: r.referredBy,
      referredTo: r.referredTo,
      referralDate: r.referralDate,
      ticket: {
        id: r.ticket_id,
        ticketNumber: r.ticketNumber,
        title: r.title,
        description: r.description,
        customerId: r.customerId,
        creationDateTime: r.creationDateTime,
        lastUpdateDate: r.lastUpdateDate,
        status: r.status,
        priority: r.priority,
        type: r.type,
        channel: r.channel,
        assignedTo: r.assignedTo,
        attachments: r.attachments,
        editableUntil: r.editableUntil,
        workSessionStartedAt: r.workSessionStartedAt,
        totalWorkDuration: r.totalWorkDuration,
        updates: [], // Note: updates are not fetched in this simplified query
      }
    }));
    
    res.json(result);
  } catch (err) {
    console.error('Error fetching referrals:', err);
    res.status(500).json({ message: 'Error fetching referrals', error: err.message });
  }
});

// --- Login API ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const user = await db('users').where({ username }).first();

        if (user) {
            // Compare the provided password with the stored hash
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // Passwords match
                const { password, ...userWithoutPassword } = user;
                res.json(userWithoutPassword);
            } else {
                // Passwords don't match
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            // User not found
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err });
    }
});

// Generic CRUD operations

// Helper to parse array fields
const parseArrayFields = (body, fields) => {
    const parsedBody = { ...body };
    fields.forEach(field => {
        if (parsedBody[field]) {
            parsedBody[field] = JSON.stringify(parsedBody[field]);
        }
    });
    return parsedBody;
};

// POST (Create)
app.post('/api/:table', async (req, res) => {
    const { table } = req.params;
    const arrayFields = {
        users: ['accessibleMenus'],
        customers: ['mobileNumbers', 'emails', 'phone', 'paymentMethods'],
        purchase_contracts: ['paymentMethods'],
        support_contracts: ['supportType'],
        tickets: ['attachments', 'updates']
    };
    try {
        const body = parseArrayFields(req.body, arrayFields[table] || []);
        const [newItem] = await db(table).insert(body).returning('*');
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: `Error creating item in ${table}`, error: err.message });
    }
});

// PUT (Update)
app.put('/api/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const arrayFields = {
        users: ['accessibleMenus'],
        customers: ['mobileNumbers', 'emails', 'phone', 'paymentMethods'],
        purchase_contracts: ['paymentMethods'],
        support_contracts: ['supportType'],
        tickets: ['attachments', 'updates']
    };
     try {
        const body = parseArrayFields(req.body, arrayFields[table] || []);
        const [updatedItem] = await db(table).where({ id }).update(body).returning('*');
        if (updatedItem) {
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: `Error updating item in ${table}`, error: err.message });
    }
});


// DELETE
app.delete('/api/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    try {
        const count = await db(table).where({ id }).del();
        if (count > 0) {
            res.status(204).send(); // No Content
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: `Error deleting item from ${table}`, error: err.message });
    }
});

// DELETE MANY
app.post('/api/:table/delete-many', async (req, res) => {
    const { table } = req.params;
    const { ids } = req.body; // Expect an array of IDs
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: 'Invalid request: "ids" must be an array.' });
    }
    try {
        const count = await db(table).whereIn('id', ids).del();
        res.status(200).json({ message: `${count} items deleted successfully.` });
    } catch (err) {
        res.status(500).json({ message: `Error deleting items from ${table}`, error: err.message });
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
