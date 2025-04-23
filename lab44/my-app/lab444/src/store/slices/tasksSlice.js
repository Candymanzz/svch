import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API operations
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            if (!response.ok) throw new Error('Failed to fetch tasks');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addTask = createAsyncThunk(
    'tasks/addTask',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            if (!response.ok) throw new Error('Failed to add task');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        loading: false,
        error: null,
        filter: 'all', // 'all', 'completed', 'active'
        sortBy: 'id', // 'id', 'title', 'completed'
    },
    reducers: {
        // Synchronous reducers
        updateTask: (state, action) => {
            const index = state.items.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
        },
        deleteTask: (state, action) => {
            state.items = state.items.filter(task => task.id !== action.payload);
        },
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add task
            .addCase(addTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { updateTask, deleteTask, setFilter, setSortBy } = tasksSlice.actions;
export default tasksSlice.reducer; 