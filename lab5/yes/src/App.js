import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Select,
  MenuItem
} from '@mui/material';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import './i18n/i18n';

const Navigation = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('items.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Select
            value={i18n.language}
            onChange={changeLanguage}
            size="small"
            sx={{ color: 'white' }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ru">Русский</MenuItem>
          </Select>
          <Button color="inherit" component={Link} to="/">
            {t('items.title')}
          </Button>
          <Button color="inherit" component={Link} to="/add">
            {t('items.add')}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navigation />
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<ItemList />} />
            <Route path="/add" element={<ItemForm />} />
            <Route path="/edit/:id" element={<ItemForm isEdit />} />
          </Routes>
        </Container>
      </Router>
    </Provider>
  );
}

export default App;
