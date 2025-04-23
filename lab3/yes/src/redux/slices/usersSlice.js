import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },
    addUser: (state, action) => {
      const newUser = {
        id: Date.now(),
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      state.users.push(newUser);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.currentUser = null;
    }
  }
});

export const {
  setCurrentUser,
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setLoading,
  setError,
  logout
} = usersSlice.actions;

export default usersSlice.reducer; 