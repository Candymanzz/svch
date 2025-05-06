const express = require('express');
const router = express.Router();
const {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers
} = require('../controllers/customerController');

// Get all customers with pagination, sorting, and filtering
router.get('/', getAllCustomers);

// Search customers
router.get('/search', searchCustomers);

// Get customer by ID
router.get('/:id', getCustomerById);

// Create new customer
router.post('/', createCustomer);

// Update customer
router.put('/:id', updateCustomer);

// Delete customer
router.delete('/:id', deleteCustomer);

module.exports = router; 