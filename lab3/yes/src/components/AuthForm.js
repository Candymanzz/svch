import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { setCurrentUser } from '../redux/slices/usersSlice';

const AuthForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData); // Для отладки

    if (isLogin) {
      dispatch(setCurrentUser({ email: formData.email }));
      console.log('Login action dispatched');
    } else {
      dispatch(setCurrentUser({
        email: formData.email,
        name: formData.name,
        id: Date.now() // Добавляем уникальный ID
      }));
      console.log('Register action dispatched');
    }

    // Редирект на главную страницу
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {isLogin ? t('auth.login') : t('auth.register')}
          </Typography>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                fullWidth
                label={t('auth.name')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
            )}
            <TextField
              fullWidth
              label={t('auth.email')}
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('auth.password')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLogin ? t('auth.login') : t('auth.register')}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? t('auth.switchToRegister') : t('auth.switchToLogin')}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthForm; 