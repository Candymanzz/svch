const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { Customer, Contract, Furniture, Sale } = require('./models');
const seedDatabase = require('./seeders/seed');

const furnitureRoutes = require('./routes/furnitureRoutes');
const customerRoutes = require('./routes/customerRoutes');
const contractRoutes = require('./routes/contractRoutes');
const saleRoutes = require('./routes/saleRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/furniture', furnitureRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/sales', saleRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Furniture Store API');
});

// Seed initial data
const start = async () => {
    try {
        // Clear existing data
        await Promise.all([
            Customer.deleteMany({}),
            Furniture.deleteMany({}),
            Contract.deleteMany({}),
            Sale.deleteMany({})
        ]);

        // Seed initial data
        await seedDatabase();
        console.log('Initial data seeded...');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

start(); 