const { Furniture } = require('../models');
const { Op } = require('sequelize');

// Get all furniture with pagination, sorting, and filtering
const getAllFurniture = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC', ...filters } = req.query;

        const whereClause = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                whereClause[key] = filters[key];
            }
        });

        const offset = (page - 1) * limit;

        const furniture = await Furniture.findAndCountAll({
            where: whereClause,
            order: [[sortBy, sortOrder]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            total: furniture.count,
            page: parseInt(page),
            totalPages: Math.ceil(furniture.count / limit),
            data: furniture.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get furniture by ID
const getFurnitureById = async (req, res) => {
    try {
        const furniture = await Furniture.findByPk(req.params.id);
        if (!furniture) {
            return res.status(404).json({ error: 'Furniture not found' });
        }
        res.json(furniture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new furniture
const createFurniture = async (req, res) => {
    try {
        const furniture = await Furniture.create(req.body);
        res.status(201).json(furniture);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update furniture
const updateFurniture = async (req, res) => {
    try {
        const furniture = await Furniture.findByPk(req.params.id);
        if (!furniture) {
            return res.status(404).json({ error: 'Furniture not found' });
        }
        await furniture.update(req.body);
        res.json(furniture);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete furniture
const deleteFurniture = async (req, res) => {
    try {
        const furniture = await Furniture.findByPk(req.params.id);
        if (!furniture) {
            return res.status(404).json({ error: 'Furniture not found' });
        }
        await furniture.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search furniture
const searchFurniture = async (req, res) => {
    try {
        const { query } = req.query;
        const furniture = await Furniture.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } },
                    { model: { [Op.iLike]: `%${query}%` } },
                    { characteristics: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });
        res.json(furniture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllFurniture,
    getFurnitureById,
    createFurniture,
    updateFurniture,
    deleteFurniture,
    searchFurniture
}; 