const { Contract, Customer } = require('../models');
const { Op } = require('sequelize');

// Get all contracts with pagination, sorting, and filtering
const getAllContracts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC', ...filters } = req.query;

        const whereClause = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                whereClause[key] = filters[key];
            }
        });

        const offset = (page - 1) * limit;

        const contracts = await Contract.findAndCountAll({
            where: whereClause,
            include: [{
                model: Customer,
                attributes: ['name', 'address', 'phone']
            }],
            order: [[sortBy, sortOrder]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            total: contracts.count,
            page: parseInt(page),
            totalPages: Math.ceil(contracts.count / limit),
            data: contracts.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get contract by ID
const getContractById = async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id, {
            include: [{
                model: Customer,
                attributes: ['name', 'address', 'phone']
            }]
        });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        res.json(contract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new contract
const createContract = async (req, res) => {
    try {
        const contract = await Contract.create(req.body);
        res.status(201).json(contract);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update contract
const updateContract = async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id);
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        await contract.update(req.body);
        res.json(contract);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete contract
const deleteContract = async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id);
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        await contract.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search contracts
const searchContracts = async (req, res) => {
    try {
        const { query } = req.query;
        const contracts = await Contract.findAll({
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
        });
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllContracts,
    getContractById,
    createContract,
    updateContract,
    deleteContract,
    searchContracts
}; 