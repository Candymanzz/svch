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

    const handleOpen = (contract = null) => {
        if (contract) {
            setEditingContract(contract);
            setFormData({
                number: contract.number,
                customerId: contract.customerId,
                date: contract.date.split('T')[0],
                executionDate: contract.executionDate.split('T')[0],
            });
        } else {
            setEditingContract(null);
            setFormData({
                number: '',
                customerId: '',
                date: new Date().toISOString().split('T')[0],
                executionDate: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingContract(null);
        setFormData({
            number: '',
            customerId: '',
            date: new Date().toISOString().split('T')[0],
            executionDate: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingContract
                ? `http://localhost:5000/api/contracts/${editingContract.id}`
                : 'http://localhost:5000/api/contracts';

            const method = editingContract ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await fetchContracts();
            handleClose();
        } catch (error) {
            console.error('Error saving contract:', error);
            setError('Failed to save contract. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this contract?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/contracts/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                await fetchContracts();
            } catch (error) {
                console.error('Error deleting contract:', error);
                setError('Failed to delete contract. Please try again.');
            }
        }
    };

    const getCustomerName = (contract) => {
        if (contract.Customer) {
            return contract.Customer.name;
        }
        const customer = customers.find(c => c.id === contract.customerId);
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
                            <TableRow key={contract.id}>
                                <TableCell>{contract.number}</TableCell>
                                <TableCell>{getCustomerName(contract)}</TableCell>
                                <TableCell>{new Date(contract.date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(contract.executionDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(contract)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(contract.id)} color="error">
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
                                <MenuItem key={customer.id} value={customer.id}>
                                    {customer.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            margin="normal"
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth
                            label="Execution Date"
                            type="date"
                            value={formData.executionDate}
                            onChange={(e) => setFormData({ ...formData, executionDate: e.target.value })}
                            margin="normal"
                            required
                            InputLabelProps={{ shrink: true }}
                        />
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