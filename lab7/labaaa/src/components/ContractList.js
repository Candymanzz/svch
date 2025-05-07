import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Typography,
    Box,
    Alert,
    MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const ContractList = () => {
    const [contracts, setContracts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        number: '',
        customerId: '',
        date: new Date().toISOString().split('T')[0],
        executionDate: '',
        totalAmount: '',
        status: 'active'
    });

    const fetchContracts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/contracts');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received contracts data:', data);

            if (data && data.data) {
                setContracts(data.data);
                setError(null);
            } else {
                setContracts([]);
                setError('No contracts found');
            }
        } catch (error) {
            console.error('Error fetching contracts:', error);
            setContracts([]);
            setError('Failed to fetch contracts. Please try again later.');
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/customers');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received customers data:', data); // debug
            if (Array.isArray(data)) {
                setCustomers(data);
            } else if (data && Array.isArray(data.data)) {
                setCustomers(data.data);
            } else {
                setCustomers([]);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
        }
    };

    useEffect(() => {
        fetchContracts();
        fetchCustomers();
    }, []);

    const validateDates = (date, executionDate) => {
        if (!date || !executionDate) return true;
        const contractDate = new Date(date);
        const execDate = new Date(executionDate);
        // Устанавливаем время в начало дня для корректного сравнения
        contractDate.setHours(0, 0, 0, 0);
        execDate.setHours(0, 0, 0, 0);
        console.log('Validating dates:', { contractDate, execDate }); // Debug log
        return execDate > contractDate;
    };

    const handleOpen = (contract = null) => {
        console.log('Opening contract form for:', contract);
        if (contract) {
            // Проверяем наличие _id
            if (!contract._id) {
                console.error('Contract has no _id:', contract);
                setError('Invalid contract data');
                return;
            }

            setEditingContract(contract);
            setFormData({
                number: contract.number,
                customerId: contract.customerId._id || contract.customerId,
                date: new Date(contract.date).toISOString().split('T')[0],
                executionDate: new Date(contract.executionDate).toISOString().split('T')[0],
                totalAmount: contract.totalAmount,
                status: contract.status
            });
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            console.log('Setting default dates:', { today, tomorrow });

            setEditingContract(null);
            setFormData({
                number: '',
                customerId: '',
                date: today.toISOString().split('T')[0],
                executionDate: tomorrow.toISOString().split('T')[0],
                totalAmount: '',
                status: 'active'
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingContract(null);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        setFormData({
            number: '',
            customerId: '',
            date: today.toISOString().split('T')[0],
            executionDate: tomorrow.toISOString().split('T')[0],
            totalAmount: '',
            status: 'active'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Проверяем даты на стороне клиента
            if (!validateDates(formData.date, formData.executionDate)) {
                setError('Execution date must be after contract date');
                return;
            }

            // Проверяем наличие ID при редактировании
            if (editingContract && !editingContract._id) {
                console.error('Editing contract has no _id:', editingContract);
                setError('Invalid contract data');
                return;
            }

            const url = editingContract
                ? `http://localhost:5000/api/contracts/${editingContract._id}`
                : 'http://localhost:5000/api/contracts';

            console.log('Submitting contract to URL:', url);
            console.log('Original form data:', formData);
            console.log('Editing contract:', editingContract);

            const method = editingContract ? 'PUT' : 'POST';

            // Преобразуем даты в ISO строки и totalAmount в число
            const contractDate = new Date(formData.date);
            contractDate.setHours(0, 0, 0, 0);

            const executionDate = new Date(formData.executionDate);
            executionDate.setHours(0, 0, 0, 0);

            // Добавляем один день к дате контракта для гарантии
            executionDate.setDate(executionDate.getDate() + 1);

            const submitData = {
                ...formData,
                date: contractDate.toISOString(),
                executionDate: executionDate.toISOString(),
                totalAmount: parseFloat(formData.totalAmount) || 0
            };

            console.log('Submitting contract data:', submitData);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Server response error:', data);
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            console.log('Server response:', data);
            await fetchContracts();
            handleClose();
            setError(null);
        } catch (error) {
            console.error('Error saving contract:', error);
            setError(error.message || 'Failed to save contract. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!id) {
            console.error('No contract ID provided for deletion');
            setError('Invalid contract ID');
            return;
        }

        if (window.confirm('Are you sure you want to delete this contract?')) {
            try {
                console.log('Deleting contract with ID:', id);
                const response = await fetch(`http://localhost:5000/api/contracts/${id}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error('Server response error:', data);
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                console.log('Contract deleted successfully');
                await fetchContracts();
                setError(null);
            } catch (error) {
                console.error('Error deleting contract:', error);
                setError(error.message || 'Failed to delete contract. Please try again.');
            }
        }
    };

    const getCustomerName = (contract) => {
        if (contract.customerId && contract.customerId.name) {
            return contract.customerId.name;
        }
        const customer = customers.find(c => c._id === contract.customerId);
        return customer ? customer.name : 'Unknown Customer';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Contracts</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Contract
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Number</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Execution Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(contracts) && contracts.map((contract) => (
                            <TableRow key={contract._id}>
                                <TableCell>{contract.number}</TableCell>
                                <TableCell>{getCustomerName(contract)}</TableCell>
                                <TableCell>{new Date(contract.date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(contract.executionDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(contract)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(contract._id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingContract ? 'Edit Contract' : 'Add New Contract'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Contract Number"
                            value={formData.number}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            select
                            fullWidth
                            label="Customer"
                            value={formData.customerId}
                            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                            margin="normal"
                            required
                        >
                            {customers.map((customer) => (
                                <MenuItem key={customer._id} value={customer._id}>
                                    {customer.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => {
                                const newDate = e.target.value;
                                console.log('Contract date changed to:', newDate); // Debug log
                                setFormData(prev => {
                                    // Если новая дата позже даты исполнения, обновляем дату исполнения
                                    if (newDate && prev.executionDate) {
                                        const contractDate = new Date(newDate);
                                        contractDate.setHours(0, 0, 0, 0);

                                        const executionDate = new Date(prev.executionDate);
                                        executionDate.setHours(0, 0, 0, 0);

                                        if (contractDate >= executionDate) {
                                            const nextDay = new Date(contractDate);
                                            nextDay.setDate(nextDay.getDate() + 1);
                                            console.log('Updating execution date to:', nextDay.toISOString().split('T')[0]); // Debug log
                                            return {
                                                ...prev,
                                                date: newDate,
                                                executionDate: nextDay.toISOString().split('T')[0]
                                            };
                                        }
                                    }
                                    return { ...prev, date: newDate };
                                });
                            }}
                            margin="normal"
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth
                            label="Execution Date"
                            type="date"
                            value={formData.executionDate}
                            onChange={(e) => {
                                const newDate = e.target.value;
                                console.log('Execution date changed to:', newDate); // Debug log
                                setFormData(prev => ({ ...prev, executionDate: newDate }));
                            }}
                            margin="normal"
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!validateDates(formData.date, formData.executionDate)}
                            helperText={!validateDates(formData.date, formData.executionDate) ? 'Execution date must be after contract date' : ''}
                            inputProps={{
                                min: formData.date ? new Date(new Date(formData.date).getTime() + 86400000).toISOString().split('T')[0] : undefined
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Total Amount"
                            type="number"
                            value={formData.totalAmount}
                            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                            margin="normal"
                            required
                            inputProps={{ min: 0, step: 0.01 }}
                        />
                        <TextField
                            select
                            fullWidth
                            label="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            margin="normal"
                            required
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editingContract ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ContractList; 