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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
    });

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/customers');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received data:', data); // Debug log

            // Handle different response formats
            let customersData = [];
            if (Array.isArray(data)) {
                customersData = data;
            } else if (data && typeof data === 'object') {
                // If data is wrapped in a property (e.g., { customers: [...] })
                if (data.customers && Array.isArray(data.customers)) {
                    customersData = data.customers;
                } else if (data.data && Array.isArray(data.data)) {
                    customersData = data.data;
                } else if (data.results && Array.isArray(data.results)) {
                    customersData = data.results;
                } else {
                    // If it's a single object, wrap it in an array
                    customersData = [data];
                }
            }

            if (customersData.length > 0) {
                setCustomers(customersData);
                setError(null);
            } else {
                setCustomers([]);
                setError('No customers found');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
            setError('Failed to fetch customers. Please try again later.');
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleOpen = (customer = null) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData({
                name: customer.name,
                address: customer.address,
                phone: customer.phone,
            });
        } else {
            setEditingCustomer(null);
            setFormData({
                name: '',
                address: '',
                phone: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCustomer(null);
        setFormData({
            name: '',
            address: '',
            phone: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingCustomer
                ? `http://localhost:5000/api/customers/${editingCustomer._id}`
                : 'http://localhost:5000/api/customers';

            const method = editingCustomer ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            await fetchCustomers();
            handleClose();
            setError(null);
        } catch (error) {
            console.error('Error saving customer:', error);
            setError(error.message || 'Failed to save customer. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                await fetchCustomers();
                setError(null);
            } catch (error) {
                console.error('Error deleting customer:', error);
                setError(error.message || 'Failed to delete customer. Please try again.');
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Customers</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Customer
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
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(customers) && customers.map((customer) => (
                            <TableRow key={customer._id}>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.address}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(customer)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(customer._id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            margin="normal"
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editingCustomer ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CustomerList; 