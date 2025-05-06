const express = require('express');
const router = express.Router();
const {
    getAllFurniture,
    getFurnitureById,
    createFurniture,
    updateFurniture,
    deleteFurniture,
    searchFurniture
} = require('../controllers/furnitureController');

// Get all furniture with pagination, sorting, and filtering
router.get('/', getAllFurniture);

// Search furniture
router.get('/search', searchFurniture);

// Get furniture by ID
router.get('/:id', getFurnitureById);

// Create new furniture
router.post('/', createFurniture);

// Update furniture
router.put('/:id', updateFurniture);

// Delete furniture
router.delete('/:id', deleteFurniture);

module.exports = router; 