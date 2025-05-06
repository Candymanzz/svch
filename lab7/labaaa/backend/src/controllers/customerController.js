const { Customer } = require('../models');
const { Op } = require('sequelize');

// Get all customers with pagination, sorting, and filtering
const getAllCustomers = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC', ...filters } = req.query;

        const whereClause = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                whereClause[key] = filters[key];
            }
        });

        const offset = (page - 1) * limit;

        const customers = await Customer.findAndCountAll({
            where: whereClause,
            order: [[sortBy, sortOrder]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            total: customers.count,
            page: parseInt(page),
            totalPages: Math.ceil(customers.count / limit),
            data: customers.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new customer
const createCustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        await customer.update(req.body);
        res.json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        await customer.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search customers
const searchCustomers = async (req, res) => {
    try {
        const { query } = req.query;
        const customers = await Customer.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } },
                    { address: { [Op.iLike]: `%${query}%` } },
                    { phone: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers
}; 