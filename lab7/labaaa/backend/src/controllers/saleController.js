const { Sale, Contract, Furniture, Customer } = require('../models');
const { Op } = require('sequelize');

// Get all sales with pagination, sorting, and filtering
const getAllSales = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC', ...filters } = req.query;

        const whereClause = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                whereClause[key] = filters[key];
            }
        });

        const offset = (page - 1) * limit;

        const sales = await Sale.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Contract,
                    include: [{
                        model: Customer,
                        attributes: ['name', 'address', 'phone']
                    }]
                },
                {
                    model: Furniture,
                    attributes: ['name', 'model', 'price']
                }
            ],
            order: [[sortBy, sortOrder]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            total: sales.count,
            page: parseInt(page),
            totalPages: Math.ceil(sales.count / limit),
            data: sales.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get sale by ID
const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findByPk(req.params.id, {
            include: [
                {
                    model: Contract,
                    include: [{
                        model: Customer,
                        attributes: ['name', 'address', 'phone']
                    }]
                },
                {
                    model: Furniture,
                    attributes: ['name', 'model', 'price']
                }
            ]
        });
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
        const sale = await Sale.create(req.body);
        res.status(201).json(sale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update sale
const updateSale = async (req, res) => {
    try {
        const sale = await Sale.findByPk(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        await sale.update(req.body);
        res.json(sale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete sale
const deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findByPk(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        await sale.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search sales
const searchSales = async (req, res) => {
    try {
        const { query } = req.query;
        const sales = await Sale.findAll({
            include: [
                {
                    model: Contract,
                    where: {
                        [Op.or]: [
                            { number: { [Op.iLike]: `%${query}%` } }
                        ]
                    },
                    include: [{
                        model: Customer,
                        where: {
                            [Op.or]: [
                                { name: { [Op.iLike]: `%${query}%` } },
                                { address: { [Op.iLike]: `%${query}%` } }
                            ]
                        }
                    }]
                },
                {
                    model: Furniture,
                    where: {
                        [Op.or]: [
                            { name: { [Op.iLike]: `%${query}%` } },
                            { model: { [Op.iLike]: `%${query}%` } }
                        ]
                    }
                }
            ]
        });
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