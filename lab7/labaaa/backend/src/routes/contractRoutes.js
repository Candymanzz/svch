const express = require('express');
const router = express.Router();
const {
    getAllContracts,
    getContractById,
    createContract,
    updateContract,
    deleteContract,
    searchContracts
} = require('../controllers/contractController');

// Get all contracts with pagination, sorting, and filtering
router.get('/', getAllContracts);

// Search contracts
router.get('/search', searchContracts);

// Get contract by ID
router.get('/:id', getContractById);

// Create new contract
router.post('/', createContract);

// Update contract
router.put('/:id', updateContract);

// Delete contract
router.delete('/:id', deleteContract);

module.exports = router; 