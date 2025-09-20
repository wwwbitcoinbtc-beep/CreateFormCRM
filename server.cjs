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
app.use(express.json());


// API Routes
app.get('/', (req, res) => {
  res.send('<h1>CRM Backend Server is running</h1>');
});

// --- Login API ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try {
        const user = await db('users').where({ username, password }).first();
        if (user) {
            // In a real app, don't send the password back.
            // Here we parse the menus from JSON string to array
            const { password, ...userWithoutPassword } = user;
            res.json({
                ...userWithoutPassword,
                accessibleMenus: JSON.parse(user.accessibleMenus || '[]')
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch(err) {
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
});


// --- Users API ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await db('users').select('*');
    // Parse accessibleMenus for each user
    const formattedUsers = users.map(u => ({...u, accessibleMenus: JSON.parse(u.accessibleMenus || '[]')}));
    res.json(formattedUsers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
    try {
        const { id, accessibleMenus, ...userData } = req.body;
        const [newUserId] = await db('users').insert({
            ...userData,
            accessibleMenus: JSON.stringify(accessibleMenus || [])
        });
        const newUser = await db('users').where({ id: newUserId }).first();
        res.status(201).json({...newUser, accessibleMenus: JSON.parse(newUser.accessibleMenus || '[]')});
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { accessibleMenus, ...userData } = req.body;
        await db('users').where({ id }).update({
            ...userData,
            accessibleMenus: JSON.stringify(accessibleMenus || [])
        });
        const updatedUser = await db('users').where({ id }).first();
        res.json({...updatedUser, accessibleMenus: JSON.parse(updatedUser.accessibleMenus || '[]')});
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db('users').where({ id }).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

app.post('/api/users/delete-many', async (req, res) => {
    try {
        const { ids } = req.body;
        await db('users').whereIn('id', ids).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting multiple users', error: err.message });
    }
});


// --- Customers API ---
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await db('customers').select('*');
    const formatted = customers.map(c => ({
        ...c,
        mobileNumbers: JSON.parse(c.mobileNumbers || '[]'),
        emails: JSON.parse(c.emails || '[]'),
        phone: JSON.parse(c.phone || '[]'),
        paymentMethods: JSON.parse(c.paymentMethods || '[]'),
    }))
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
    try {
        const { id, mobileNumbers, emails, phone, paymentMethods, ...customerData } = req.body;
        const [newId] = await db('customers').insert({
            ...customerData,
            mobileNumbers: JSON.stringify(mobileNumbers || []),
            emails: JSON.stringify(emails || []),
            phone: JSON.stringify(phone || []),
            paymentMethods: JSON.stringify(paymentMethods || []),
        });
        const newCustomer = await db('customers').where({ id: newId }).first();
        res.status(201).json({
            ...newCustomer,
            mobileNumbers: JSON.parse(newCustomer.mobileNumbers || '[]'),
            emails: JSON.parse(newCustomer.emails || '[]'),
            phone: JSON.parse(newCustomer.phone || '[]'),
            paymentMethods: JSON.parse(newCustomer.paymentMethods || '[]'),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error creating customer', error: err.message });
    }
});

app.put('/api/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { mobileNumbers, emails, phone, paymentMethods, ...customerData } = req.body;
        await db('customers').where({ id }).update({
            ...customerData,
            mobileNumbers: JSON.stringify(mobileNumbers || []),
            emails: JSON.stringify(emails || []),
            phone: JSON.stringify(phone || []),
            paymentMethods: JSON.stringify(paymentMethods || []),
        });
        const updatedCustomer = await db('customers').where({ id }).first();
        res.json({
            ...updatedCustomer,
            mobileNumbers: JSON.parse(updatedCustomer.mobileNumbers || '[]'),
            emails: JSON.parse(updatedCustomer.emails || '[]'),
            phone: JSON.parse(updatedCustomer.phone || '[]'),
            paymentMethods: JSON.parse(updatedCustomer.paymentMethods || '[]'),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating customer', error: err.message });
    }
});

app.delete('/api/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db('customers').where({ id }).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting customer', error: err.message });
    }
});

app.post('/api/customers/delete-many', async (req, res) => {
    try {
        const { ids } = req.body;
        await db('customers').whereIn('id', ids).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting multiple customers', error: err.message });
    }
});


// --- Purchase Contracts API ---
app.get('/api/purchase-contracts', async (req, res) => {
  try {
    const contracts = await db('purchase_contracts').select('*');
    res.json(contracts.map(c => ({
        ...c,
        paymentMethods: JSON.parse(c.paymentMethods || '[]')
    })));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching purchase contracts', error: err.message });
  }
});

app.post('/api/purchase-contracts', async (req, res) => {
    try {
        const { id, paymentMethods, ...contractData } = req.body;
        const [newId] = await db('purchase_contracts').insert({
            ...contractData,
            paymentMethods: JSON.stringify(paymentMethods || [])
        });
        const newContract = await db('purchase_contracts').where({id: newId}).first();
        res.status(201).json({...newContract, paymentMethods: JSON.parse(newContract.paymentMethods || '[]')});
    } catch (err) {
        res.status(500).json({ message: 'Error creating purchase contract', error: err.message });
    }
});

app.put('/api/purchase-contracts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentMethods, ...contractData } = req.body;
        await db('purchase_contracts').where({ id }).update({
            ...contractData,
            paymentMethods: JSON.stringify(paymentMethods || [])
        });
        const updatedContract = await db('purchase_contracts').where({id}).first();
        res.json({...updatedContract, paymentMethods: JSON.parse(updatedContract.paymentMethods || '[]')});
    } catch (err) {
        res.status(500).json({ message: 'Error updating purchase contract', error: err.message });
    }
});

app.delete('/api/purchase-contracts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db('purchase_contracts').where({ id }).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting purchase contract', error: err.message });
    }
});

app.post('/api/purchase-contracts/delete-many', async (req, res) => {
    try {
        const { ids } = req.body;
        await db('purchase_contracts').whereIn('id', ids).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting multiple purchase contracts', error: err.message });
    }
});


// --- Support Contracts API ---
app.get('/api/support-contracts', async (req, res) => {
  try {
    const contracts = await db('support_contracts').select('*');
    res.json(contracts.map(c => ({
        ...c,
        supportType: JSON.parse(c.supportType || '[]')
    })));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching support contracts', error: err.message });
  }
});

app.post('/api/support-contracts', async (req, res) => {
    try {
        const { id, supportType, ...contractData } = req.body;
        const [newId] = await db('support_contracts').insert({
            ...contractData,
            supportType: JSON.stringify(supportType || [])
        });
        const newContract = await db('support_contracts').where({id: newId}).first();
        res.status(201).json({...newContract, supportType: JSON.parse(newContract.supportType || '[]')});
    } catch (err) {
        res.status(500).json({ message: 'Error creating support contract', error: err.message });
    }
});

app.put('/api/support-contracts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { supportType, ...contractData } = req.body;
        await db('support_contracts').where({ id }).update({
            ...contractData,
            supportType: JSON.stringify(supportType || [])
        });
        const updatedContract = await db('support_contracts').where({id}).first();
        res.json({...updatedContract, supportType: JSON.parse(updatedContract.supportType || '[]')});
    } catch (err) {
        res.status(500).json({ message: 'Error updating support contract', error: err.message });
    }
});

app.delete('/api/support-contracts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db('support_contracts').where({ id }).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting support contract', error: err.message });
    }
});

app.post('/api/support-contracts/delete-many', async (req, res) => {
    try {
        const { ids } = req.body;
        await db('support_contracts').whereIn('id', ids).del();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting multiple support contracts', error: err.message });
    }
});


// --- Tickets API ---
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await db('tickets').select('*');
    res.json(tickets.map(t => ({
        ...t,
        attachments: JSON.parse(t.attachments || '[]'),
        updates: [], // Updates should be fetched from their own table if needed
    })));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets', error: err.message });
  }
});

app.post('/api/tickets', async (req, res) => {
    try {
        const { id, attachments, updates, ...ticketData } = req.body;
        const [newId] = await db('tickets').insert({
            ...ticketData,
            attachments: JSON.stringify(attachments || []),
        });
        const newTicket = await db('tickets').where({ id: newId }).first();
        res.status(201).json({
            ...newTicket,
            attachments: JSON.parse(newTicket.attachments || '[]'),
            updates: []
        });
    } catch (err) {
        res.status(500).json({ message: 'Error creating ticket', error: err.message });
    }
});

app.put('/api/tickets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { attachments, updates, ...ticketData } = req.body;
        await db('tickets').where({ id }).update({
            ...ticketData,
            attachments: JSON.stringify(attachments || []),
        });
        const updatedTicket = await db('tickets').where({ id }).first();
        res.json({
            ...updatedTicket,
            attachments: JSON.parse(updatedTicket.attachments || '[]'),
            updates: []
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating ticket', error: err.message });
    }
});


// --- Referrals API ---
app.get('/api/referrals', async (req, res) => {
  try {
    const referrals = await db('referrals')
      .join('tickets', 'referrals.ticket_id', '=', 'tickets.id')
      .select(
        'referrals.id as referralId',
        'referrals.referredBy',
        'referrals.referredTo',
        'referrals.referralDate',
        'tickets.id as ticketId',
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
      
    const results = referrals.map(r => ({
        id: r.referralId,
        referredBy: r.referredBy,
        referredTo: r.referredTo,
        referralDate: r.referralDate,
        ticket: {
            id: r.ticketId,
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
            attachments: JSON.parse(r.attachments || '[]'),
            updates: [], // Updates are in a separate table
            editableUntil: r.editableUntil,
            workSessionStartedAt: r.workSessionStartedAt,
            totalWorkDuration: r.totalWorkDuration,
        }
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching referrals', error: err.message });
  }
});

app.post('/api/referrals', async (req, res) => {
    try {
        const { ticket_id, referredBy, referredTo, referralDate } = req.body;
        
        // Start a transaction
        await db.transaction(async trx => {
            // 1. Insert the referral
            const [newReferralId] = await trx('referrals').insert({
                ticket_id,
                referredBy,
                referredTo,
                referralDate
            });

            // 2. Update the ticket status and assignee
            await trx('tickets')
                .where({ id: ticket_id })
                .update({ 
                    status: 'ارجاع شده',
                    assignedTo: referredTo
                });

            // 3. Fetch the created referral with the full ticket object
            const newReferral = await trx('referrals')
                .where('referrals.id', newReferralId)
                .join('tickets', 'referrals.ticket_id', '=', 'tickets.id')
                .select(
                    'referrals.id as referralId',
                    'referrals.referredBy',
                    'referrals.referredTo',
                    'referrals.referralDate',
                    'tickets.*'
                )
                .first();
            
            const result = {
                id: newReferral.referralId,
                referredBy: newReferral.referredBy,
                referredTo: newReferral.referredTo,
                referralDate: newReferral.referralDate,
                ticket: {
                    ...newReferral,
                    id: newReferral.ticket_id,
                    attachments: JSON.parse(newReferral.attachments || '[]'),
                    updates: []
                }
            }
             res.status(201).json(result);
        });

    } catch (err) {
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
