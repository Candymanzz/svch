import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import UsersList from './components/UsersList';
import TasksList from './components/TasksList';
import Navbar from './components/Navbar';

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

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/users" element={<UsersList />} />
                <Route path="/tasks" element={<TasksList />} />
                <Route path="/" element={<UsersList />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
