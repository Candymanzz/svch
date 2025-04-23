import { createSlice } from '@reduxjs/toolkit';
import itemsData from '../data/items.json';

// Функция для сохранения данных в localStorage
const saveToLocalStorage = (items) => {
    localStorage.setItem('items', JSON.stringify(items));
};

// Функция для загрузки данных из localStorage
const loadFromLocalStorage = () => {
    const savedItems = localStorage.getItem('items');
    return savedItems ? JSON.parse(savedItems) : itemsData;
};

const initialState = {
    items: loadFromLocalStorage(),
    filters: {
        search: '',
        sortBy: 'name',
        sortOrder: 'asc'
    },
    loading: false,
    error: null
};

const itemSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        deleteItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveToLocalStorage(state.items);
        },
        updateItem: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
                saveToLocalStorage(state.items);
            }
        },
        addItem: (state, action) => {
            const newItem = {
                id: Math.max(...state.items.map(item => item.id)) + 1,
                ...action.payload
            };
            state.items.push(newItem);
            saveToLocalStorage(state.items);
        }
    }
});

export const { setFilters, deleteItem, updateItem, addItem } = itemSlice.actions;
export default itemSlice.reducer; 