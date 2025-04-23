import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todos: [],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    searchQuery: '',
  }
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        ...action.payload,
        completed: false,
        createdAt: new Date().toISOString()
      };
      state.todos.push(newTodo);
    },
    toggleTodo: (state, action) => {
      const todo = state.todos.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    updateTodo: (state, action) => {
      const index = state.todos.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], ...action.payload };
      }
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter(item => item.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    editTodo: (state, action) => {
      const { id, text } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.text = text;
      }
    },
  }
});

export const {
  setTodos,
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
  setLoading,
  setError,
  updateFilters,
  editTodo
} = todosSlice.actions;

export default todosSlice.reducer; 