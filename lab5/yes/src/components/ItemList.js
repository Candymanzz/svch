import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography
} from '@mui/material';
import { setFilters, deleteItem } from '../store/itemSlice';
import ExportData from './ExportData';

const ItemList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, filters } = useSelector(state => state.items);

    const handleDelete = (id) => {
        dispatch(deleteItem(id));
    };

    const handleSearch = (event) => {
        dispatch(setFilters({ search: event.target.value }));
    };

    const handleSort = (event) => {
        dispatch(setFilters({ sortBy: event.target.value }));
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const filteredItems = items
        .filter(item =>
            item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.description.toLowerCase().includes(filters.search.toLowerCase())
        )
        .sort((a, b) => {
            const order = filters.sortOrder === 'asc' ? 1 : -1;
            if (filters.sortBy === 'price') {
                return (a.price - b.price) * order;
            }
            return a[filters.sortBy].localeCompare(b[filters.sortBy]) * order;
        });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                {t('items.title')}
            </Typography>

            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                    label={t('items.search')}
                    variant="outlined"
                    value={filters.search}
                    onChange={handleSearch}
                    sx={{ minWidth: 200 }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>{t('items.sort')}</InputLabel>
                    <Select
                        value={filters.sortBy}
                        label={t('items.sort')}
                        onChange={handleSort}
                    >
                        <MenuItem value="name">{t('items.name')}</MenuItem>
                        <MenuItem value="price">{t('items.price')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('items.name')}</TableCell>
                            <TableCell>{t('items.description')}</TableCell>
                            <TableCell>{t('items.price')}</TableCell>
                            <TableCell>{t('items.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    {t('items.noItems')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>${item.price}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleEdit(item.id)}
                                            >
                                                {t('items.edit')}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                {t('items.delete')}
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ExportData />
        </Box>
    );
};

export default ItemList; 