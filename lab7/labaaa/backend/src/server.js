const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
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

// Test database connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Sync database and seed initial data
const start = async () => {
    try {
        // Синхронизация моделей с базой данных
        await sequelize.sync({ force: true });
        console.log('Database synced...');

        // Заполнение базы данных начальными данными
        await seedDatabase();
        console.log('Initial data seeded...');

        // Routes
        app.use('/api/furniture', furnitureRoutes);
        app.use('/api/customers', customerRoutes);
        app.use('/api/contracts', contractRoutes);
        app.use('/api/sales', saleRoutes);

        // Basic route
        app.get('/', (req, res) => {
            res.send('Furniture Store API');
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

start(); 