import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchTasks, addTask, updateTask, deleteTask, setFilter, setSortBy } from '../store/slices/tasksSlice';
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
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel
} from '@mui/material';

const TasksList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { items: tasks, loading, error, filter, sortBy } = useSelector((state) => state.tasks);
    const [newTask, setNewTask] = useState({ title: '', completed: false });
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTask.title) {
            dispatch(addTask(newTask));
            setNewTask({ title: '', completed: false });
        }
    };

    const handleUpdateTask = (e) => {
        e.preventDefault();
        if (editingTask) {
            dispatch(updateTask(editingTask));
            setEditingTask(null);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'active') return !task.completed;
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'completed') return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        return a.id - b.id;
    });

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
                {t('tasks')}
            </Typography>

            {/* Filters and Sort */}
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>{t('status')}</InputLabel>
                        <Select
                            value={filter}
                            onChange={(e) => dispatch(setFilter(e.target.value))}
                            label={t('status')}
                        >
                            <MenuItem value="all">{t('all')}</MenuItem>
                            <MenuItem value="completed">{t('completed')}</MenuItem>
                            <MenuItem value="active">{t('active')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>{t('sortBy')}</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={(e) => dispatch(setSortBy(e.target.value))}
                            label={t('sortBy')}
                        >
                            <MenuItem value="id">ID</MenuItem>
                            <MenuItem value="title">{t('title')}</MenuItem>
                            <MenuItem value="completed">{t('status')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} style={{ marginBottom: '20px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            label={t('title')}
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={!newTask.title}
                        >
                            {t('addTask')}
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {/* Tasks List */}
            <Grid container spacing={3}>
                {sortedTasks.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                        <Card>
                            <CardContent>
                                {editingTask?.id === task.id ? (
                                    <form onSubmit={handleUpdateTask}>
                                        <TextField
                                            fullWidth
                                            label={t('title')}
                                            value={editingTask.title}
                                            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                            margin="normal"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={editingTask.completed}
                                                    onChange={(e) => setEditingTask({ ...editingTask, completed: e.target.checked })}
                                                />
                                            }
                                            label={t('completed')}
                                        />
                                        <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
                                            {t('save')}
                                        </Button>
                                        <Button variant="outlined" onClick={() => setEditingTask(null)}>
                                            {t('cancel')}
                                        </Button>
                                    </form>
                                ) : (
                                    <>
                                        <Typography variant="h6" component="h3">
                                            {task.title}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            {t('status')}: {task.completed ? t('completed') : t('active')}
                                        </Typography>
                                    </>
                                )}
                            </CardContent>
                            {!editingTask && (
                                <CardActions>
                                    <Button size="small" onClick={() => setEditingTask(task)}>
                                        {t('edit')}
                                    </Button>
                                    <Button size="small" color="error" onClick={() => dispatch(deleteTask(task.id))}>
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

export default TasksList; 