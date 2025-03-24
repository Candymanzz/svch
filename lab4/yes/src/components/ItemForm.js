import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Grid
} from '@mui/material';
import { addItem, updateItem } from '../store/itemSlice';

const ItemForm = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const items = useSelector(state => state.items.items);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            const item = items.find(item => item.id === parseInt(id));
            if (item) {
                setFormData({
                    name: item.name,
                    description: item.description,
                    price: item.price
                });
            }
        }
    }, [id, items]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = t('form.required');
        }
        if (!formData.description.trim()) {
            newErrors.description = t('form.required');
        }
        if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
            newErrors.price = t('form.required');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const itemData = {
            ...formData,
            id: id ? parseInt(id) : Date.now(),
            price: Number(formData.price)
        };

        if (id) {
            dispatch(updateItem(itemData));
        } else {
            dispatch(addItem(itemData));
        }

        navigate('/');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {id ? t('items.edit') : t('items.add')}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('form.name')}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('form.description')}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                error={!!errors.description}
                                helperText={errors.description}
                                multiline
                                rows={4}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('form.price')}
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                error={!!errors.price}
                                helperText={errors.price}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    {t('form.save')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/')}
                                >
                                    {t('form.cancel')}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default ItemForm; 