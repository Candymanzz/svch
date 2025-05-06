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
    const [furniture, setFurniture] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        customer_id: '',
        furniture_id: '',
        quantity: '',
        total_amount: '',
        status: 'pending',
    });

    const fetchContracts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/contracts');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received contracts data:', data); // Debug log

            // Handle different response formats
            let contractsData = [];
            if (Array.isArray(data)) {
                contractsData = data;
            } else if (data && typeof data === 'object') {
                // If data is wrapped in a property (e.g., { contracts: [...] })
                if (data.contracts && Array.isArray(data.contracts)) {
                    contractsData = data.contracts;
                } else if (data.data && Array.isArray(data.data)) {
                    contractsData = data.data;
                } else if (data.results && Array.isArray(data.results)) {
                    contractsData = data.results;
                } else {
                    // If it's a single object, wrap it in an array
                    contractsData = [data];
                }
            }

            if (contractsData.length > 0) {
                setContracts(contractsData);
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
            setCustomers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
        }
    };

    const fetchFurniture = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/furniture');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFurniture(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching furniture:', error);
            setFurniture([]);
        }
    };

    useEffect(() => {
        fetchContracts();
        fetchCustomers();
        fetchFurniture();
    }, []);

    const handleOpen = (contract = null) => {
        if (contract) {
            setEditingContract(contract);
            setFormData({
                customer_id: contract.customer_id,
                furniture_id: contract.furniture_id,
                quantity: contract.quantity,
                total_amount: contract.total_amount,
                status: contract.status,
            });
        } else {
            setEditingContract(null);
            setFormData({
                customer_id: '',
                furniture_id: '',
                quantity: '',
                total_amount: '',
                status: 'pending',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingContract(null);
        setFormData({
            customer_id: '',
            furniture_id: '',
            quantity: '',
            total_amount: '',
            status: 'pending',
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

    const getCustomerName = (customerId) => {
        const customer = customers.find(c => c.id === customerId);
        return customer ? customer.name : 'Unknown Customer';
    };

    const getFurnitureName = (furnitureId) => {
        const item = furniture.find(f => f.id === furnitureId);
        return item ? item.name : 'Unknown Furniture';
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
                            <TableCell>Customer</TableCell>
                            <TableCell>Furniture</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(contracts) && contracts.map((contract) => (
                            <TableRow key={contract.id}>
                                <TableCell>{getCustomerName(contract.customer_id)}</TableCell>
                                <TableCell>{getFurnitureName(contract.furniture_id)}</TableCell>
                                <TableCell>{contract.quantity}</TableCell>
                                <TableCell>${contract.total_amount}</TableCell>
                                <TableCell>{contract.status}</TableCell>
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
                            select
                            fullWidth
                            label="Customer"
                            value={formData.customer_id}
                            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
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
                            select
                            fullWidth
                            label="Furniture"
                            value={formData.furniture_id}
                            onChange={(e) => setFormData({ ...formData, furniture_id: e.target.value })}
                            margin="normal"
                            required
                        >
                            {furniture.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            margin="normal"
                            required
                            inputProps={{ min: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Total Amount"
                            type="number"
                            value={formData.total_amount}
                            onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
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
                            <MenuItem value="pending">Pending</MenuItem>
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