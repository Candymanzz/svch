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
    const [contracts, setContracts] = useState([]);
    const [furniture, setFurniture] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingSale, setEditingSale] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        contractId: '',
        furnitureId: '',
        quantity: '',
    });

    const fetchSales = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/sales');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received sales data:', data); // Debug log
            console.log('First sale object structure:', data.data?.[0]); // Debug log for first sale

            // Handle paginated response format from backend
            if (data && data.data) {
                setSales(data.data);
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

    const fetchContracts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/contracts');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received contracts data:', data); // debug
            if (Array.isArray(data)) {
                setContracts(data);
            } else if (data && Array.isArray(data.data)) {
                setContracts(data.data);
            } else {
                setContracts([]);
            }
        } catch (error) {
            console.error('Error fetching contracts:', error);
            setContracts([]);
        }
    };

    const fetchFurniture = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/furniture');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received furniture data:', data); // debug
            if (Array.isArray(data)) {
                setFurniture(data);
            } else if (data && Array.isArray(data.data)) {
                setFurniture(data.data);
            } else {
                setFurniture([]);
            }
        } catch (error) {
            console.error('Error fetching furniture:', error);
            setFurniture([]);
        }
    };

    useEffect(() => {
        fetchSales();
        fetchContracts();
        fetchFurniture();
    }, []);

    const handleOpen = (sale = null) => {
        if (sale) {
            setEditingSale(sale);
            setFormData({
                contractId: sale.contractId,
                furnitureId: sale.furnitureId,
                quantity: sale.quantity,
            });
        } else {
            setEditingSale(null);
            setFormData({
                contractId: '',
                furnitureId: '',
                quantity: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingSale(null);
        setFormData({
            contractId: '',
            furnitureId: '',
            quantity: '',
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

    const getContractNumber = (sale) => {
        if (sale.Contract) {
            return sale.Contract.number;
        }
        return 'Unknown Contract';
    };

    const getFurnitureName = (sale) => {
        if (sale.Furniture) {
            return sale.Furniture.name;
        }
        return 'Unknown Furniture';
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
                            <TableCell>Contract</TableCell>
                            <TableCell>Furniture</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(sales) && sales.map((sale) => (
                            <TableRow key={sale.id}>
                                <TableCell>{getContractNumber(sale)}</TableCell>
                                <TableCell>{getFurnitureName(sale)}</TableCell>
                                <TableCell>{sale.quantity}</TableCell>
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
                            label="Contract"
                            value={formData.contractId}
                            onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
                            margin="normal"
                            required
                        >
                            {contracts.map((contract) => (
                                <MenuItem key={contract.id} value={contract.id}>
                                    {contract.number}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            fullWidth
                            label="Furniture"
                            value={formData.furnitureId}
                            onChange={(e) => setFormData({ ...formData, furnitureId: e.target.value })}
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