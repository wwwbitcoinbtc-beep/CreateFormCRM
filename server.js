import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';
import knexConfig from './knexfile.js';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

const db = knex(knexConfig.development);
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_super_secret_key';

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


// --- JWT Verification Middleware ---
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        console.log('Access denied: No token provided');
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Access denied: Invalid token', err.message);
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};


// --- API Routes ---

// Public route: No token needed
app.get('/', (req, res) => {
  res.send('<h1>CRM Backend Server is running</h1>');
});

// Public route: Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const user = await db('users').where({ username }).first();
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // Sign JWT
                const { password, ...userWithoutPassword } = user;
                const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '24h' });
                console.log(`User '${username}' logged in successfully.`);
                res.json({ token, user: userWithoutPassword });
            } else {
                console.log(`Login failed for user '${username}': Invalid password`);
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            console.log(`Login failed: User '${username}' not found`);
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});


// --- Protected Routes ---
// All routes below this point will use the verifyToken middleware
app.use('/api', verifyToken);


// Helper to parse array fields
const parseArrayFields = (body, fields) => {
    const parsedBody = { ...body };
    fields.forEach(field => {
        if (parsedBody[field] && typeof parsedBody[field] !== 'string') {
            parsedBody[field] = JSON.stringify(parsedBody[field]);
        }
    });
    return parsedBody;
};

// Generic GET ALL
app.get('/api/:table', async (req, res) => {
    try {
        const items = await db(req.params.table).select('*');
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: `Error fetching from ${req.params.table}`, error: err.message });
    }
});


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
        const body = { 
            ...req.body,
            creationDateTime: new Date().toISOString(), // Set creation time on server
            lastUpdateDate: new Date().toISOString()   // Set update time on server
        };
        const parsedBody = parseArrayFields(body, arrayFields[table] || []);
        
        const [newItem] = await db(table).insert(parsedBody).returning('*');
        console.log(`New item created in '${table}':`, newItem);

        // Emit a socket event for real-time updates
        io.emit(`${table}_created`, newItem);
        console.log(`Socket event '${table}_created' emitted.`);
        
        res.status(201).json(newItem);
    } catch (err) {
        console.error(`Error creating item in ${table}:`, err);
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
        const body = {
            ...req.body,
            lastUpdateDate: new Date().toISOString() // Set update time on server
        };
        const parsedBody = parseArrayFields(body, arrayFields[table] || []);
        const [updatedItem] = await db(table).where({ id }).update(parsedBody).returning('*');
        
        if (updatedItem) {
            console.log(`Item updated in '${table}' (ID: ${id}):`, updatedItem);
            // Emit a socket event for real-time updates
            io.emit(`${table}_updated`, updatedItem);
            console.log(`Socket event '${table}_updated' emitted.`);
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(`Error updating item in ${table} (ID: ${id}):`, err);
        res.status(500).json({ message: `Error updating item in ${table}`, error: err.message });
    }
});


// DELETE
app.delete('/api/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    try {
        const count = await db(table).where({ id }).del();
        if (count > 0) {
            console.log(`Item deleted from '${table}' (ID: ${id})`);
            // Emit a socket event for real-time updates
            io.emit(`${table}_deleted`, { id });
            console.log(`Socket event '${table}_deleted' emitted.`);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(`Error deleting item from ${table} (ID: ${id}):`, err);
        res.status(500).json({ message: `Error deleting item from ${table}`, error: err.message });
    }
});


// --- Socket.io Connection ---
io.on('connection', (socket) => {
  console.log('A user connected via Socket.io:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// --- Start Server ---
server.listen(PORT, () => {
  console.log(`Server is listening on *:${PORT}`);
  db.raw('SELECT 1').then(() => {
    console.log('SQL Server connected successfully.');
  }).catch((e) => {
    console.error('Failed to connect to SQL Server.');
    console.error(e);
  });
});
