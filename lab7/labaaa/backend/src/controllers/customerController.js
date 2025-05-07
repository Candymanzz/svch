const Customer = require('../models/Customer');
const Contract = require('../models/Contract');

// Get all customers with pagination, sorting, and filtering
const getAllCustomers = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', ...filters } = req.query;

        const query = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                query[key] = { $regex: filters[key], $options: 'i' };
            }
        });

        const customers = await Customer.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Customer.countDocuments(query);

        res.json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: customers
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create new customer
const createCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(400).json({ error: error.message });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Проверяем существование клиента
        const existingCustomer = await Customer.findById(id);
        if (!existingCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Обновляем данные
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        res.json(updatedCustomer);
    } catch (error) {
        console.error('Error updating customer:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update customer' });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        // Проверяем существование клиента
        const existingCustomer = await Customer.findById(id);
        if (!existingCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Проверяем, есть ли связанные контракты
        const hasContracts = await Contract.exists({ customerId: id });
        if (hasContracts) {
            return res.status(400).json({
                error: 'Cannot delete customer with existing contracts'
            });
        }

        await Customer.findByIdAndDelete(id);
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ error: 'Failed to delete customer' });
    }
};

// Search customers
const searchCustomers = async (req, res) => {
    try {
        const { query } = req.query;
        const customers = await Customer.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } },
                { address: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(customers);
    } catch (error) {
        console.error('Error searching customers:', error);
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