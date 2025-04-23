import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TodoList from './components/TodoList';
import AuthForm from './components/AuthForm';
import './i18n/config';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.users);
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<AuthForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
