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

const SaleList = () => {
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [furniture, setFurniture] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingSale, setEditingSale] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        customer_id: '',
        furniture_id: '',
        quantity: '',
        total_amount: '',
        sale_date: new Date().toISOString().split('T')[0],
    });

    const fetchSales = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/sales');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received sales data:', data); // Debug log

            // Handle different response formats
            let salesData = [];
            if (Array.isArray(data)) {
                salesData = data;
            } else if (data && typeof data === 'object') {
                // If data is wrapped in a property (e.g., { sales: [...] })
                if (data.sales && Array.isArray(data.sales)) {
                    salesData = data.sales;
                } else if (data.data && Array.isArray(data.data)) {
                    salesData = data.data;
                } else if (data.results && Array.isArray(data.results)) {
                    salesData = data.results;
                } else {
                    // If it's a single object, wrap it in an array
                    salesData = [data];
                }
            }

            if (salesData.length > 0) {
                setSales(salesData);
                setError(null);
            } else {
                setSales([]);
                setError('No sales found');
            }
        } catch (error) {
            console.error('Error fetching sales:', error);
            setSales([]);
            setError('Failed to fetch sales. Please try again later.');
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
        fetchSales();
        fetchCustomers();
        fetchFurniture();
    }, []);

    const handleOpen = (sale = null) => {
        if (sale) {
            setEditingSale(sale);
            setFormData({
                customer_id: sale.customer_id,
                furniture_id: sale.furniture_id,
                quantity: sale.quantity,
                total_amount: sale.total_amount,
                sale_date: new Date(sale.sale_date).toISOString().split('T')[0],
            });
        } else {
            setEditingSale(null);
            setFormData({
                customer_id: '',
                furniture_id: '',
                quantity: '',
                total_amount: '',
                sale_date: new Date().toISOString().split('T')[0],
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingSale(null);
        setFormData({
            customer_id: '',
            furniture_id: '',
            quantity: '',
            total_amount: '',
            sale_date: new Date().toISOString().split('T')[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingSale
                ? `http://localhost:5000/api/sales/${editingSale.id}`
                : 'http://localhost:5000/api/sales';

            const method = editingSale ? 'PUT' : 'POST';

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

            await fetchSales();
            handleClose();
        } catch (error) {
            console.error('Error saving sale:', error);
            setError('Failed to save sale. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/sales/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                await fetchSales();
            } catch (error) {
                console.error('Error deleting sale:', error);
                setError('Failed to delete sale. Please try again.');
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
                <Typography variant="h5">Sales</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Sale
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
                            <TableCell>Sale Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(sales) && sales.map((sale) => (
                            <TableRow key={sale.id}>
                                <TableCell>{getCustomerName(sale.customer_id)}</TableCell>
                                <TableCell>{getFurnitureName(sale.furniture_id)}</TableCell>
                                <TableCell>{sale.quantity}</TableCell>
                                <TableCell>${sale.total_amount}</TableCell>
                                <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(sale)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(sale.id)} color="error">
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
                    {editingSale ? 'Edit Sale' : 'Add New Sale'}
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
                            fullWidth
                            label="Sale Date"
                            type="date"
                            value={formData.sale_date}
                            onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                            margin="normal"
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editingSale ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SaleList; 