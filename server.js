import express from 'express';
import cors from 'cors';
import Knex from 'knex';
import knexConfig from './knexfile.js';

const app = express();
const port = 3001;

const knex = Knex(knexConfig.development);

app.use(cors());
app.use(express.json());

// Test DB connection
knex.raw('SELECT 1').then(() => {
    console.log('SQL Server connected successfully.');
}).catch((err) => {
    console.error('Failed to connect to SQL Server:', err);
});

// --- API Endpoints ---

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await knex('users').where({ username, password }).first();
        if (user) {
            // In a real app, don't send the password back
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});


// Generic GET endpoint
const getData = async (tableName, res) => {
    try {
        const data = await knex(tableName).select('*');
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: `Error fetching ${tableName}`, error: error.message });
    }
};

// Generic POST endpoint
const postData = async (tableName, req, res) => {
    try {
        const [newItem] = await knex(tableName).insert(req.body).returning('*');
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: `Error creating ${tableName}`, error: error.message });
    }
};

// Generic PUT endpoint
const putData = async (tableName, req, res) => {
    try {
        const { id } = req.params;
        const [updatedItem] = await knex(tableName).where({ id }).update(req.body).returning('*');
        if (updatedItem) {
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Error updating ${tableName}`, error: error.message });
    }
};

// Generic DELETE endpoint
const deleteData = async (tableName, req, res) => {
    try {
        const { id } = req.params;
        const deletedCount = await knex(tableName).where({ id }).del();
        if (deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Error deleting ${tableName}`, error: error.message });
    }
};

// Generic Delete Many endpoint
const deleteMany = async (tableName, req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: 'Invalid input: "ids" must be an array.' });
        }
        const deletedCount = await knex(tableName).whereIn('id', ids).del();
        res.status(200).json({ message: `${deletedCount} items deleted.` });
    } catch (error) {
        res.status(500).json({ message: `Error deleting multiple items from ${tableName}`, error: error.message });
    }
};


// --- Route Definitions ---

// Users
app.get('/api/users', (req, res) => getData('users', res));
app.post('/api/users', (req, res) => postData('users', req, res));
app.put('/api/users/:id', (req, res) => putData('users', req, res));
app.delete('/api/users/:id', (req, res) => deleteData('users', req, res));
app.post('/api/users/delete-many', (req, res) => deleteMany('users', req, res));

// Customers
app.get('/api/customers', (req, res) => getData('customers', res));
app.post('/api/customers', (req, res) => postData('customers', req, res));
app.put('/api/customers/:id', (req, res) => putData('customers', req, res));
app.delete('/api/customers/:id', (req, res) => deleteData('customers', req, res));
app.post('/api/customers/delete-many', (req, res) => deleteMany('customers', req, res));

// Purchase Contracts
app.get('/api/purchase-contracts', (req, res) => getData('purchase_contracts', res));
app.post('/api/purchase-contracts', (req, res) => postData('purchase_contracts', req, res));
app.put('/api/purchase-contracts/:id', (req, res) => putData('purchase_contracts', req, res));
app.delete('/api/purchase-contracts/:id', (req, res) => deleteData('purchase_contracts', req, res));
app.post('/api/purchase-contracts/delete-many', (req, res) => deleteMany('purchase_contracts', req, res));

// Support Contracts
app.get('/api/support-contracts', (req, res) => getData('support_contracts', res));
app.post('/api/support-contracts', (req, res) => postData('support_contracts', req, res));
app.put('/api/support-contracts/:id', (req, res) => putData('support_contracts', req, res));
app.delete('/api/support-contracts/:id', (req, res) => deleteData('support_contracts', req, res));
app.post('/api/support-contracts/delete-many', (req, res) => deleteMany('support_contracts', req, res));

// Tickets
app.get('/api/tickets', async (req, res) => {
    try {
        const tickets = await knex('tickets').select(
            'id', 'ticketNumber', 'title', 'description', 'customerId',
            'creationDateTime', 'lastUpdateDate', 'status', 'priority', 'type',
            'channel', 'assignedTo', 'attachments', 'editableUntil',
            'workSessionStartedAt', 'totalWorkDuration'
        );
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
});
app.post('/api/tickets', (req, res) => postData('tickets', req, res));
app.put('/api/tickets/:id', (req, res) => putData('tickets', req, res));
app.delete('/api/tickets/:id', (req, res) => deleteData('tickets', req, res));

// Referrals
app.get('/api/referrals', async (req, res) => {
    try {
        const referrals = await knex('referrals')
            .join('tickets', 'referrals.ticket_id', '=', 'tickets.id')
            .select(
                'referrals.id as id',
                'referrals.referredBy',
                'referrals.referredTo',
                'referrals.referralDate',
                knex.raw(`json_build_object(
                    'id', tickets.id,
                    'ticketNumber', tickets.ticketNumber,
                    'title', tickets.title,
                    'description', tickets.description,
                    'customerId', tickets.customerId,
                    'creationDateTime', tickets.creationDateTime,
                    'lastUpdateDate', tickets.lastUpdateDate,
                    'status', tickets.status,
                    'priority', tickets.priority,
                    'type', tickets.type,
                    'channel', tickets.channel,
                    'assignedTo', tickets.assignedTo,
                    'attachments', tickets.attachments,
                    'editableUntil', tickets.editableUntil,
                    'workSessionStartedAt', tickets.workSessionStartedAt,
                    'totalWorkDuration', tickets.totalWorkDuration,
                    'updates', '[]'::json
                ) as ticket`)
            );

        res.json(referrals.map(r => ({ ...r, ticket: JSON.parse(r.ticket) }))); // Parse the JSON string
    } catch (error) {
        res.status(500).json({ message: 'Error fetching referrals', error: error.message });
    }
});
app.post('/api/referrals', async (req, res) => {
     try {
        const { ticket_id, referredBy, referredTo, referralDate } = req.body;
        
        // Start a transaction
        await knex.transaction(async trx => {
            // 1. Insert the referral
            const [newReferral] = await trx('referrals').insert({ ticket_id, referredBy, referredTo, referralDate }).returning('*');

            // 2. Update the ticket status
            await trx('tickets').where({ id: ticket_id }).update({ status: 'ارجاع شده', assignedTo: referredTo });

            // 3. Fetch the updated ticket to include in the response
            const ticket = await trx('tickets').where({ id: ticket_id }).first();
            
             // 4. Combine and send response
            res.status(201).json({ ...newReferral, ticket });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating referral', error: error.message });
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server is listening on *: ${port}`);
});
