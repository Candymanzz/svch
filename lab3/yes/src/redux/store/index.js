import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../slices/todosSlice';
import usersReducer from '../slices/usersSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    users: usersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 