import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchUsers, addUser, updateUser, deleteUser } from '../store/slices/usersSlice';
import {
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    CircularProgress,
    Alert
} from '@mui/material';

const UsersList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { items: users, loading, error } = useSelector((state) => state.users);
    const [newUser, setNewUser] = useState({ name: '', email: '' });
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleAddUser = (e) => {
        e.preventDefault();
        if (newUser.name && newUser.email) {
            dispatch(addUser(newUser));
            setNewUser({ name: '', email: '' });
        }
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        if (editingUser) {
            dispatch(updateUser(editingUser));
            setEditingUser(null);
        }
    };

    if (loading) return (
        <Container style={{ textAlign: 'center', marginTop: '20px' }}>
            <CircularProgress />
        </Container>
    );

    if (error) return (
        <Container style={{ marginTop: '20px' }}>
            <Alert severity="error">{t('error')}: {error}</Alert>
        </Container>
    );

    return (
        <Container>
            <Typography variant="h4" component="h2" gutterBottom>
                {t('users')}
            </Typography>

            {/* Add User Form */}
            <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label={t('name')}
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label={t('email')}
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={!newUser.name || !newUser.email}
                        >
                            {t('addUser')}
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {/* Users List */}
            <Grid container spacing={3}>
                {users.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                        <Card>
                            <CardContent>
                                {editingUser?.id === user.id ? (
                                    <form onSubmit={handleUpdateUser}>
                                        <TextField
                                            fullWidth
                                            label={t('name')}
                                            value={editingUser.name}
                                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                            margin="normal"
                                        />
                                        <TextField
                                            fullWidth
                                            label={t('email')}
                                            type="email"
                                            value={editingUser.email}
                                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                            margin="normal"
                                        />
                                        <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
                                            {t('save')}
                                        </Button>
                                        <Button variant="outlined" onClick={() => setEditingUser(null)}>
                                            {t('cancel')}
                                        </Button>
                                    </form>
                                ) : (
                                    <>
                                        <Typography variant="h6" component="h3">
                                            {user.name}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            {user.email}
                                        </Typography>
                                    </>
                                )}
                            </CardContent>
                            {!editingUser && (
                                <CardActions>
                                    <Button size="small" onClick={() => setEditingUser(user)}>
                                        {t('edit')}
                                    </Button>
                                    <Button size="small" color="error" onClick={() => dispatch(deleteUser(user.id))}>
                                        {t('delete')}
                                    </Button>
                                </CardActions>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default UsersList; 