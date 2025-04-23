import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Button, Select, MenuItem, FormControl } from '@mui/material';

const Navbar = () => {
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (event) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <div style={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to="/">
                        {t('home')}
                    </Button>
                    <Button color="inherit" component={Link} to="/users">
                        {t('users')}
                    </Button>
                    <Button color="inherit" component={Link} to="/tasks">
                        {t('tasks')}
                    </Button>
                </div>
                <FormControl>
                    <Select
                        value={i18n.language}
                        onChange={handleLanguageChange}
                        style={{ color: 'white', marginLeft: '20px' }}
                    >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="ru">Русский</MenuItem>
                    </Select>
                </FormControl>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 