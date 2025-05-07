const Sale = require('../models/Sale');
const Contract = require('../models/Contract');
const Furniture = require('../models/Furniture');
const Customer = require('../models/Customer');

// Get all sales with pagination, sorting, and filtering
const getAllSales = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', ...filters } = req.query;

        const query = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                if (key === 'price' || key === 'quantity') {
                    query[key] = parseFloat(filters[key]);
                } else if (key === 'date') {
                    query[key] = new Date(filters[key]);
                } else {
                    query[key] = { $regex: filters[key], $options: 'i' };
                }
            }
        });

        const sales = await Sale.find(query)
            .populate({
                path: 'contractId',
                populate: {
                    path: 'customerId',
                    select: 'name address phone'
                }
            })
            .populate('furnitureId', 'name model price')
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Sale.countDocuments(query);

        res.json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: sales
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get sale by ID
const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate({
                path: 'contractId',
                populate: {
                    path: 'customerId',
                    select: 'name address phone'
                }
            })
            .populate('furnitureId', 'name model price');
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        res.json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new sale
const createSale = async (req, res) => {
    try {
        const sale = new Sale(req.body);
        await sale.save();
        const populatedSale = await Sale.findById(sale._id)
            .populate({
                path: 'contractId',
                populate: {
                    path: 'customerId',
                    select: 'name address phone'
                }
            })
            .populate('furnitureId', 'name model price');
        res.status(201).json(populatedSale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update sale
const updateSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate({
                path: 'contractId',
                populate: {
                    path: 'customerId',
                    select: 'name address phone'
                }
            })
            .populate('furnitureId', 'name model price');

        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        res.json(sale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete sale
const deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        res.json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search sales
const searchSales = async (req, res) => {
    try {
        const { query } = req.query;
        const sales = await Sale.find({
            $or: [
                { price: { $regex: query, $options: 'i' } },
                { quantity: { $regex: query, $options: 'i' } }
            ]
        })
            .populate({
                path: 'contractId',
                populate: {
                    path: 'customerId',
                    select: 'name address phone'
                }
            })
            .populate('furnitureId', 'name model price');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
    searchSales
}; 