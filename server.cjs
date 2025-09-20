// This is your Node.js server backend.
// You can use this as a starting point for your local development.

const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile.cjs');

const app = express();
const db = knex(knexConfig.development);

const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase payload size for file uploads if needed


// Helper to parse JSON fields from DB
const parseJSON = (data, fields) => {
    if (!data) return data;
    const items = Array.isArray(data) ? data : [data];
    items.forEach(item => {
        fields.forEach(field => {
            if (typeof item[field] === 'string') {
                try {
                    item[field] = JSON.parse(item[field]);
                } catch (e) {
                    // console.error(`Could not parse JSON for field ${field}:`, item[field]);
                    item[field] = []; // Default to empty array on parse error
                }
            }
        });
    });
    return Array.isArray(data) ? items : items[0];
};

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('<h1>CRM Backend Server is running</h1>');
});

// --- Auth API ---
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        const user = await db('users').where({ username, password }).first();
        if (user) {
            res.json(parseJSON(user, ['accessibleMenus']));
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
});


// --- Users API ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await db('users').select('*');
    res.json(parseJSON(users, ['accessibleMenus']));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

app.post('/api/users', async (req, res) => {
    try {
        const { id, ...userData } = req.body;
        const [newUserId] = await db('users').insert({
            ...userData,
            accessibleMenus: JSON.stringify(userData.accessibleMenus),
        });
        const newUser = await db('users').where({ id: newUserId }).first();
        res.status(201).json(parseJSON(newUser, ['accessibleMenus']));
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { id, ...userData } = req.body;
        await db('users').where({ id: req.params.id }).update({
            ...userData,
            accessibleMenus: JSON.stringify(userData.accessibleMenus),
        });
        const updatedUser = await db('users').where({ id: req.params.id }).first();
        res.json(parseJSON(updatedUser, ['accessibleMenus']));
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await db('users').where({ id: req.params.id }).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
});

app.post('/api/users/delete-many', async (req, res) => {
    try {
        const { ids } = req.body;
        await db('users').whereIn('id', ids).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting users', error: err });
    }
});

// --- Customers API ---
const customerJsonFields = ['mobileNumbers', 'emails', 'phone', 'paymentMethods'];

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await db('customers').select('*');
    res.json(parseJSON(customers, customerJsonFields));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err });
  }
});

app.post('/api/customers', async (req, res) => {
    try {
        const { id, ...customerData } = req.body;
        customerJsonFields.forEach(field => {
            if (customerData[field]) customerData[field] = JSON.stringify(customerData[field]);
        });
        const [newCustomerId] = await db('customers').insert(customerData);
        const newCustomer = await db('customers').where({ id: newCustomerId }).first();
        res.status(201).json(parseJSON(newCustomer, customerJsonFields));
    } catch (err) {
        res.status(500).json({ message: 'Error creating customer', error: err });
    }
});

app.put('/api/customers/:id', async (req, res) => {
    try {
        const { id, ...customerData } = req.body;
        customerJsonFields.forEach(field => {
            if (customerData[field]) customerData[field] = JSON.stringify(customerData[field]);
        });
        await db('customers').where({ id: req.params.id }).update(customerData);
        const updatedCustomer = await db('customers').where({ id: req.params.id }).first();
        res.json(parseJSON(updatedCustomer, customerJsonFields));
    } catch (err) {
        res.status(500).json({ message: 'Error updating customer', error: err });
    }
});

app.delete('/api/customers/:id', async (req, res) => {
    try {
        await db('customers').where({ id: req.params.id }).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting customer', error: err });
    }
});

app.post('/api/customers/delete-many', async (req, res) => {
    try {
        const { ids } = req.body;
        await db('customers').whereIn('id', ids).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting customers', error: err });
    }
});


// --- Purchase Contracts API ---
const purchaseContractJsonFields = ['paymentMethods'];
app.get('/api/purchase-contracts', async (req, res) => {
  try {
    const contracts = await db('purchase_contracts').select('*');
    res.json(parseJSON(contracts, purchaseContractJsonFields));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching purchase contracts', error: err });
  }
});

app.post('/api/purchase-contracts', async (req, res) => {
    try {
        const { id, ...contractData } = req.body;
        purchaseContractJsonFields.forEach(field => {
            if (contractData[field]) contractData[field] = JSON.stringify(contractData[field]);
        });
        const [newId] = await db('purchase_contracts').insert(contractData);
        const newContract = await db('purchase_contracts').where({ id: newId }).first();
        res.status(201).json(parseJSON(newContract, purchaseContractJsonFields));
    } catch(err) {
        res.status(500).json({ message: 'Error creating purchase contract', error: err });
    }
});

app.put('/api/purchase-contracts/:id', async (req, res) => {
    try {
        const { id, ...contractData } = req.body;
        purchaseContractJsonFields.forEach(field => {
            if (contractData[field]) contractData[field] = JSON.stringify(contractData[field]);
        });
        await db('purchase_contracts').where({ id: req.params.id }).update(contractData);
        const updatedContract = await db('purchase_contracts').where({ id: req.params.id }).first();
        res.json(parseJSON(updatedContract, purchaseContractJsonFields));
    } catch (err) {
        res.status(500).json({ message: 'Error updating purchase contract', error: err });
    }
});

app.delete('/api/purchase-contracts/:id', async (req, res) => {
    try {
        await db('purchase_contracts').where({ id: req.params.id }).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting purchase contract', error: err });
    }
});

app.post('/api/purchase-contracts/delete-many', async (req, res) => {
    try {
        const { ids } = req.body;
        await db('purchase_contracts').whereIn('id', ids).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting purchase contracts', error: err });
    }
});

// --- Support Contracts API ---
const supportContractJsonFields = ['supportType'];
app.get('/api/support-contracts', async (req, res) => {
  try {
    const contracts = await db('support_contracts').select('*');
    res.json(parseJSON(contracts, supportContractJsonFields));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching support contracts', error: err });
  }
});

app.post('/api/support-contracts', async (req, res) => {
    try {
        const { id, ...contractData } = req.body;
        supportContractJsonFields.forEach(field => {
            if (contractData[field]) contractData[field] = JSON.stringify(contractData[field]);
        });
        const [newId] = await db('support_contracts').insert(contractData);
        const newContract = await db('support_contracts').where({ id: newId }).first();
        res.status(201).json(parseJSON(newContract, supportContractJsonFields));
    } catch(err) {
        res.status(500).json({ message: 'Error creating support contract', error: err });
    }
});

app.put('/api/support-contracts/:id', async (req, res) => {
    try {
        const { id, ...contractData } = req.body;
        supportContractJsonFields.forEach(field => {
            if (contractData[field]) contractData[field] = JSON.stringify(contractData[field]);
        });
        await db('support_contracts').where({ id: req.params.id }).update(contractData);
        const updatedContract = await db('support_contracts').where({ id: req.params.id }).first();
        res.json(parseJSON(updatedContract, supportContractJsonFields));
    } catch (err) {
        res.status(500).json({ message: 'Error updating support contract', error: err });
    }
});

app.delete('/api/support-contracts/:id', async (req, res) => {
    try {
        await db('support_contracts').where({ id: req.params.id }).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting support contract', error: err });
    }
});

app.post('/api/support-contracts/delete-many', async (req, res) => {
    try {
        const { ids } = req.body;
        await db('support_contracts').whereIn('id', ids).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting support contracts', error: err });
    }
});


// --- Tickets API ---
const ticketJsonFields = ['attachments', 'updates'];
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await db('tickets').select('*');
    res.json(parseJSON(tickets, ticketJsonFields));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets', error: err });
  }
});

app.post('/api/tickets', async (req, res) => {
    try {
        const { id, ...ticketData } = req.body;
        ticketJsonFields.forEach(field => {
            if (ticketData[field]) ticketData[field] = JSON.stringify(ticketData[field]);
        });
        const [newId] = await db('tickets').insert(ticketData);
        const newTicket = await db('tickets').where({ id: newId }).first();
        res.status(201).json(parseJSON(newTicket, ticketJsonFields));
    } catch(err) {
        res.status(500).json({ message: 'Error creating ticket', error: err });
    }
});

app.put('/api/tickets/:id', async (req, res) => {
    try {
        const { id, ...ticketData } = req.body;
        ticketJsonFields.forEach(field => {
            if (ticketData[field]) ticketData[field] = JSON.stringify(ticketData[field]);
        });
        await db('tickets').where({ id: req.params.id }).update(ticketData);
        const updatedTicket = await db('tickets').where({ id: req.params.id }).first();
        res.json(parseJSON(updatedTicket, ticketJsonFields));
    } catch (err) {
        res.status(500).json({ message: 'Error updating ticket', error: err });
    }
});

// --- Referrals API ---
app.get('/api/referrals', async (req, res) => {
    try {
        const referrals = await db('referrals')
            .join('tickets', 'referrals.ticket_id', '=', 'tickets.id')
            .select(
                'referrals.id',
                'referrals.referralDate',
                'referrals.referredBy',
                'referrals.referredTo',
                'tickets.*',
                'tickets.id as ticket_id'
            );
        
        const formattedReferrals = referrals.map(r => ({
            id: r.id,
            referralDate: r.referralDate,
            referredBy: r.referredBy,
            referredTo: r.referredTo,
            ticket: parseJSON({
                ...r,
                id: r.ticket_id, // ensure ticket id is correct
            }, ticketJsonFields)
        }));
        
        res.json(formattedReferrals);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching referrals', error: err });
    }
});

app.post('/api/referrals', async (req, res) => {
    try {
        const { ticket_id, referredBy, referredTo, referralDate } = req.body;
        
        // Start a transaction
        await db.transaction(async trx => {
            // Update the original ticket status to 'ارجاع شده'
            await trx('tickets').where({ id: ticket_id }).update({ status: 'ارجاع شده' });

            // Insert the new referral record
            const [newId] = await trx('referrals').insert({
                ticket_id,
                referredBy,
                referredTo,
                referralDate,
            });

            // Fetch the newly created referral with its ticket
            const newReferral = await trx('referrals')
                .where('referrals.id', newId)
                .join('tickets', 'referrals.ticket_id', '=', 'tickets.id')
                .select(
                    'referrals.id',
                    'referrals.referralDate',
                    'referrals.referredBy',
                    'referrals.referredTo',
                    'tickets.*',
                    'tickets.id as ticket_id'
                ).first();

             res.status(201).json({
                id: newReferral.id,
                referralDate: newReferral.referralDate,
                referredBy: newReferral.referredBy,
                referredTo: newReferral.referredTo,
                ticket: parseJSON({
                    ...newReferral,
                    id: newReferral.ticket_id
                }, ticketJsonFields)
            });
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating referral', error: err.message });
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
