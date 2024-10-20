// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Sequelize setup
const sequelize = new Sequelize('youaquire_dev', 'youaquire_user', 'gehaktbal18', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: console.log
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Add this before your routes
console.log('Loaded models:', Object.keys(db));
Object.keys(db).forEach(modelName => {
  console.log(`Model ${modelName}:`, db[modelName]);
});

/**
 * Register a new business owner
 * POST /api/register
 * Body: { email: String, password: String }
 */
app.post('/api/register', async (req, res) => {S
  try {
    const { email, password } = req.body;
    const existingOwner = await db.BusinessOwner.findOne({ where: { email } });
    if (existingOwner) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await db.BusinessOwner.create({ email, passwordHash });
    res.status(201).json({ message: 'Business owner registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

/**
 * Login for business owners
 * POST /api/login
 * Body: { email: String, password: String }
 */
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    console.log('Available models:', Object.keys(db));
    console.log('BusinessOwner model:', db.BusinessOwner);
    
    if (!db.BusinessOwner) {
      throw new Error('BusinessOwner model not found');
    }
    
    const owner = await db.BusinessOwner.findOne({ where: { email } });
    if (!owner) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const passwordMatch = await bcrypt.compare(password, owner.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

/**
 * Add a new client
 * POST /api/clients
 * Body: { email: String, youtubeUsername: String }
 */
app.post('/api/clients', async (req, res) => {
  try {
    const { email, youtubeUsername } = req.body;
    const owner = await db.BusinessOwner.findOne({ where: { email } });
    if (!owner) {
      return res.status(404).json({ error: 'Business owner not found.' });
    }
    const newClient = await db.Client.create({ youtubeUsername, businessOwnerId: owner.id });
    res.status(201).json({ message: 'Client added successfully.', client: newClient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Get all clients for a business owner
 * GET /api/clients?email=owner@example.com
 */
app.get('/api/clients', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Fetching clients for email:', email);
    const owner = await db.BusinessOwner.findOne({ where: { email }, include: db.Client });
    if (!owner) {
      console.log('Business owner not found');
      return res.status(404).json({ error: 'Business owner not found.' });
    }
    console.log('Clients found:', owner.Clients);
    res.status(200).json({ clients: owner.Clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/test', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Sync database before starting the server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});
