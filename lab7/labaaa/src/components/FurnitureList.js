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

const FurnitureList = () => {
    const [furniture, setFurniture] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingFurniture, setEditingFurniture] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        characteristics: '',
        price: '',
        image: '',
    });

    const fetchFurniture = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/furniture');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received furniture data:', data); // Debug log

            // Handle different response formats
            let furnitureData = [];
            if (Array.isArray(data)) {
                furnitureData = data;
            } else if (data && typeof data === 'object') {
                // If data is wrapped in a property (e.g., { furniture: [...] })
                if (data.furniture && Array.isArray(data.furniture)) {
                    furnitureData = data.furniture;
                } else if (data.data && Array.isArray(data.data)) {
                    furnitureData = data.data;
                } else if (data.results && Array.isArray(data.results)) {
                    furnitureData = data.results;
                } else {
                    // If it's a single object, wrap it in an array
                    furnitureData = [data];
                }
            }

            if (furnitureData.length > 0) {
                setFurniture(furnitureData);
                setError(null);
            } else {
                setFurniture([]);
                setError('No furniture items found');
            }
        } catch (error) {
            console.error('Error fetching furniture:', error);
            setFurniture([]);
            setError('Failed to fetch furniture. Please try again later.');
        }
    };

    useEffect(() => {
        fetchFurniture();
    }, []);

    const handleOpen = (item = null) => {
        if (item) {
            setEditingFurniture(item);
            setFormData({
                name: item.name,
                model: item.model,
                characteristics: item.characteristics,
                price: item.price,
                image: item.image || '',
            });
        } else {
            setEditingFurniture(null);
            setFormData({
                name: '',
                model: '',
                characteristics: '',
                price: '',
                image: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingFurniture(null);
        setFormData({
            name: '',
            model: '',
            characteristics: '',
            price: '',
            image: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingFurniture
                ? `http://localhost:5000/api/furniture/${editingFurniture._id}`
                : 'http://localhost:5000/api/furniture';

            const method = editingFurniture ? 'PUT' : 'POST';

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

            await fetchFurniture();
            handleClose();
            setError(null);
        } catch (error) {
            console.error('Error saving furniture:', error);
            setError(error.message || 'Failed to save furniture. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this furniture item?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/furniture/${id}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                await fetchFurniture();
                setError(null);
            } catch (error) {
                console.error('Error deleting furniture:', error);
                setError(error.message || 'Failed to delete furniture. Please try again.');
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Furniture</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Furniture
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
                            <TableCell>Model</TableCell>
                            <TableCell>Characteristics</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(furniture) && furniture.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.model}</TableCell>
                                <TableCell>{item.characteristics}</TableCell>
                                <TableCell>${item.price}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(item)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(item._id)} color="error">
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
                    {editingFurniture ? 'Edit Furniture' : 'Add New Furniture'}
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
                            label="Model"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Characteristics"
                            value={formData.characteristics}
                            onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                            margin="normal"
                            required
                            multiline
                            rows={3}
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            margin="normal"
                            required
                            inputProps={{ min: 0, step: 0.01 }}
                        />
                        <TextField
                            fullWidth
                            label="Image URL"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            margin="normal"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editingFurniture ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FurnitureList; 