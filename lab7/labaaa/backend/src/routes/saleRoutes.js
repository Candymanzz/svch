const express = require('express');
const router = express.Router();
const {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
    searchSales
} = require('../controllers/saleController');

// Get all sales with pagination, sorting, and filtering
router.get('/', getAllSales);

// Search sales
router.get('/search', searchSales);

// Get sale by ID
router.get('/:id', getSaleById);

// Create new sale
router.post('/', createSale);

// Update sale
router.put('/:id', updateSale);

// Delete sale
router.delete('/:id', deleteSale);

module.exports = router; 