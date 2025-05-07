const Contract = require('../models/Contract');
const Customer = require('../models/Customer');

// Get all contracts with pagination, sorting, and filtering
const getAllContracts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', ...filters } = req.query;

        const query = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                if (key === 'totalAmount') {
                    query[key] = parseFloat(filters[key]);
                } else if (key === 'date' || key === 'executionDate') {
                    query[key] = new Date(filters[key]);
                } else {
                    query[key] = { $regex: filters[key], $options: 'i' };
                }
            }
        });

        const contracts = await Contract.find(query)
            .populate('customerId', 'name address phone')
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Contract.countDocuments(query);

        res.json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: contracts
        });
    } catch (error) {
        console.error('Error fetching contracts:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get contract by ID
const getContractById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching contract with ID:', id); // Debug log

        if (!id) {
            return res.status(400).json({ error: 'Contract ID is required' });
        }

        const contract = await Contract.findById(id)
            .populate('customerId', 'name address phone');

        if (!contract) {
            console.log('Contract not found with ID:', id); // Debug log
            return res.status(404).json({ error: 'Contract not found' });
        }

        console.log('Found contract:', contract); // Debug log
        res.json(contract);
    } catch (error) {
        console.error('Error fetching contract by ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid contract ID format' });
        }
        res.status(500).json({ error: error.message });
    }
};

// Create new contract
const createContract = async (req, res) => {
    try {
        console.log('Creating contract with data:', req.body); // Debug log

        // Проверяем существование клиента
        const customer = await Customer.findById(req.body.customerId);
        if (!customer) {
            console.log('Customer not found with ID:', req.body.customerId); // Debug log
            return res.status(400).json({ error: 'Customer not found' });
        }

        // Преобразуем даты и устанавливаем время в начало дня
        const contractDate = new Date(req.body.date);
        contractDate.setHours(0, 0, 0, 0);

        const executionDate = new Date(req.body.executionDate);
        executionDate.setHours(0, 0, 0, 0);

        // Проверяем, что дата исполнения после даты контракта
        if (executionDate <= contractDate) {
            return res.status(400).json({ error: 'Execution date must be after contract date' });
        }

        const contractData = {
            ...req.body,
            date: contractDate,
            executionDate: executionDate
        };

        console.log('Creating contract with processed data:', contractData); // Debug log

        const contract = new Contract(contractData);
        await contract.save();

        const populatedContract = await Contract.findById(contract._id)
            .populate('customerId', 'name address phone');

        console.log('Created contract:', populatedContract); // Debug log
        res.status(201).json(populatedContract);
    } catch (error) {
        console.error('Error creating contract:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

// Update contract
const updateContract = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Updating contract with ID:', id);
        console.log('Update data:', req.body);

        if (!id) {
            return res.status(400).json({ error: 'Contract ID is required' });
        }

        // Проверяем существование контракта
        const existingContract = await Contract.findById(id);
        if (!existingContract) {
            console.log('Contract not found with ID:', id);
            return res.status(404).json({ error: 'Contract not found' });
        }

        // Проверяем существование клиента
        if (req.body.customerId) {
            const customer = await Customer.findById(req.body.customerId);
            if (!customer) {
                console.log('Customer not found with ID:', req.body.customerId);
                return res.status(400).json({ error: 'Customer not found' });
            }
        }

        // Преобразуем даты и устанавливаем время в начало дня
        let updateData = { ...req.body };

        if (req.body.date) {
            const contractDate = new Date(req.body.date);
            contractDate.setHours(0, 0, 0, 0);
            updateData.date = contractDate;
        }

        if (req.body.executionDate) {
            const executionDate = new Date(req.body.executionDate);
            executionDate.setHours(0, 0, 0, 0);
            updateData.executionDate = executionDate;

            // Проверяем, что дата исполнения после даты контракта
            const contractDate = updateData.date || existingContract.date;
            const contractDateStart = new Date(contractDate);
            contractDateStart.setHours(0, 0, 0, 0);

            if (executionDate <= contractDateStart) {
                return res.status(400).json({ error: 'Execution date must be after contract date' });
            }
        }

        console.log('Updating contract with processed data:', updateData);

        // Сначала обновляем документ без валидации
        const updatedContract = await Contract.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: false // Отключаем валидацию при обновлении
            }
        ).populate('customerId', 'name address phone');

        if (!updatedContract) {
            console.log('Contract not found after update attempt');
            return res.status(404).json({ error: 'Contract not found' });
        }

        // Проверяем валидацию вручную
        if (updatedContract.executionDate <= updatedContract.date) {
            return res.status(400).json({ error: 'Execution date must be after contract date' });
        }

        console.log('Updated contract:', updatedContract);
        res.json(updatedContract);
    } catch (error) {
        console.error('Error updating contract:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid contract ID format' });
        }
        res.status(500).json({ error: error.message });
    }
};

// Delete contract
const deleteContract = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting contract with ID:', id); // Debug log

        if (!id) {
            return res.status(400).json({ error: 'Contract ID is required' });
        }

        // Проверяем существование контракта
        const existingContract = await Contract.findById(id);
        if (!existingContract) {
            console.log('Contract not found with ID:', id); // Debug log
            return res.status(404).json({ error: 'Contract not found' });
        }

        await Contract.findByIdAndDelete(id);
        console.log('Contract deleted successfully'); // Debug log
        res.json({ message: 'Contract deleted successfully' });
    } catch (error) {
        console.error('Error deleting contract:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid contract ID format' });
        }
        res.status(500).json({ error: error.message });
    }
};

// Search contracts
const searchContracts = async (req, res) => {
    try {
        const { query } = req.query;
        console.log('Searching contracts with query:', query); // Debug log

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const contracts = await Contract.find({
            $or: [
                { number: { $regex: query, $options: 'i' } },
                { status: { $regex: query, $options: 'i' } }
            ]
        }).populate('customerId', 'name address phone');

        console.log('Found contracts:', contracts); // Debug log
        res.json(contracts);
    } catch (error) {
        console.error('Error searching contracts:', error);
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