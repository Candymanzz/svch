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
        image: ''
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
                contractId: sale.contractId._id || sale.contractId,
                furnitureId: sale.furnitureId._id || sale.furnitureId,
                quantity: sale.quantity,
                image: sale.image || ''
            });
        } else {
            setEditingSale(null);
            setFormData({
                contractId: '',
                furnitureId: '',
                quantity: '',
                image: ''
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
            image: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingSale
                ? `http://localhost:5000/api/sales/${editingSale._id}`
                : 'http://localhost:5000/api/sales';

            const method = editingSale ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    quantity: parseInt(formData.quantity, 10)
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            await fetchSales();
            handleClose();
            setError(null);
        } catch (error) {
            console.error('Error saving sale:', error);
            setError(error.message || 'Failed to save sale. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!id) {
            console.error('No sale ID provided for deletion');
            setError('Invalid sale ID');
            return;
        }

        if (window.confirm('Are you sure you want to delete this sale?')) {
            try {
                console.log('Deleting sale with ID:', id);
                const response = await fetch(`http://localhost:5000/api/sales/${id}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error('Server response error:', data);
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                console.log('Sale deleted successfully');
                await fetchSales();
                setError(null);
            } catch (error) {
                console.error('Error deleting sale:', error);
                setError(error.message || 'Failed to delete sale. Please try again.');
            }
        }
    };

    const getContractNumber = (sale) => {
        if (sale.contractId && sale.contractId.number) {
            return sale.contractId.number;
        }
        return 'Unknown Contract';
    };

    const getFurnitureName = (sale) => {
        if (sale.furnitureId && sale.furnitureId.name) {
            return sale.furnitureId.name;
        }
        return 'Unknown Furniture';
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
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
                            <TableCell>Image</TableCell>
                            <TableCell>Contract</TableCell>
                            <TableCell>Furniture</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(sales) && sales.map((sale) => (
                            <TableRow key={sale._id}>
                                <TableCell>
                                    {sale.image ? (
                                        <img
                                            src={sale.image}
                                            alt="Sale"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <Box sx={{ width: '50px', height: '50px', bgcolor: 'grey.200' }} />
                                    )}
                                </TableCell>
                                <TableCell>{getContractNumber(sale)}</TableCell>
                                <TableCell>{getFurnitureName(sale)}</TableCell>
                                <TableCell>{sale.quantity}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(sale)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(sale._id)} color="error">
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
                        <Box sx={{ mb: 2 }}>
                            <input
                                accept="image/*"
                                type="file"
                                id="image-upload"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="image-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    fullWidth
                                >
                                    {formData.image ? 'Change Image' : 'Upload Image'}
                                </Button>
                            </label>
                            {formData.image && (
                                <Box sx={{ mt: 1, textAlign: 'center' }}>
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                                    />
                                </Box>
                            )}
                        </Box>
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
                                <MenuItem key={contract._id} value={contract._id}>
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
                                <MenuItem key={item._id} value={item._id}>
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