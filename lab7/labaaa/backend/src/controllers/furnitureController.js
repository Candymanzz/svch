const Furniture = require('../models/Furniture');

// Get all furniture with pagination, sorting, and filtering
const getAllFurniture = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', ...filters } = req.query;

        const query = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                if (key === 'price') {
                    query[key] = parseFloat(filters[key]);
                } else {
                    query[key] = { $regex: filters[key], $options: 'i' };
                }
            }
        });

        const furniture = await Furniture.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Furniture.countDocuments(query);

        res.json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: furniture
        });
    } catch (error) {
        console.error('Error fetching furniture:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get furniture by ID
const getFurnitureById = async (req, res) => {
    try {
        const furniture = await Furniture.findById(req.params.id);
        if (!furniture) {
            return res.status(404).json({ error: 'Furniture not found' });
        }
        res.json(furniture);
    } catch (error) {
        console.error('Error fetching furniture by ID:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create new furniture
const createFurniture = async (req, res) => {
    try {
        // Преобразуем цену в число
        const furnitureData = {
            ...req.body,
            price: parseFloat(req.body.price)
        };

        const furniture = new Furniture(furnitureData);
        await furniture.save();
        res.status(201).json(furniture);
    } catch (error) {
        console.error('Error creating furniture:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to create furniture' });
    }
};

// Update furniture
const updateFurniture = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            price: parseFloat(req.body.price)
        };

        // Проверяем существование мебели
        const existingFurniture = await Furniture.findById(id);
        if (!existingFurniture) {
            return res.status(404).json({ error: 'Furniture not found' });
        }

        // Обновляем данные
        const updatedFurniture = await Furniture.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        res.json(updatedFurniture);
    } catch (error) {
        console.error('Error updating furniture:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update furniture' });
    }
};

// Delete furniture
const deleteFurniture = async (req, res) => {
    try {
        const { id } = req.params;

        // Проверяем существование мебели
        const existingFurniture = await Furniture.findById(id);
        if (!existingFurniture) {
            return res.status(404).json({ error: 'Furniture not found' });
        }

        await Furniture.findByIdAndDelete(id);
        res.json({ message: 'Furniture deleted successfully' });
    } catch (error) {
        console.error('Error deleting furniture:', error);
        res.status(500).json({ error: 'Failed to delete furniture' });
    }
};

// Search furniture
const searchFurniture = async (req, res) => {
    try {
        const { query } = req.query;
        const furniture = await Furniture.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { model: { $regex: query, $options: 'i' } },
                { characteristics: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(furniture);
    } catch (error) {
        console.error('Error searching furniture:', error);
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