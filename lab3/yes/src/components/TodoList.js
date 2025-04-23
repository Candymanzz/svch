import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { addTodo, toggleTodo, deleteTodo, editTodo } from '../redux/slices/todosSlice';

const TodoList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      dispatch(
        addTodo({
          id: Date.now(),
          text: newTodo,
          completed: false,
          priority,
        })
      );
      setNewTodo('');
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = (id) => {
    if (editText.trim()) {
      dispatch(editTodo({ id, text: editText }));
      setEditingTodo(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditText('');
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !todo.completed) ||
      (statusFilter === 'completed' && todo.completed);
    const matchesPriority =
      priorityFilter === 'all' || todo.priority === priorityFilter;
    const matchesSearch = todo.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t('todos.title')}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label={t('todos.addTodo')}
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>{t('todos.priority')}</InputLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                label={t('todos.priority')}
              >
                <MenuItem value="high">{t('todos.high')}</MenuItem>
                <MenuItem value="medium">{t('todos.medium')}</MenuItem>
                <MenuItem value="low">{t('todos.low')}</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTodo}
            >
              {t('todos.add')}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label={t('todos.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>{t('todos.status')}</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label={t('todos.status')}
              >
                <MenuItem value="all">{t('todos.all')}</MenuItem>
                <MenuItem value="active">{t('todos.active')}</MenuItem>
                <MenuItem value="completed">{t('todos.completed')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>{t('todos.priority')}</InputLabel>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                label={t('todos.priority')}
              >
                <MenuItem value="all">{t('todos.all')}</MenuItem>
                <MenuItem value="high">{t('todos.high')}</MenuItem>
                <MenuItem value="medium">{t('todos.medium')}</MenuItem>
                <MenuItem value="low">{t('todos.low')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <List>
            {filteredTodos.map((todo) => (
              <ListItem
                key={todo.id}
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                }}
              >
                {editingTodo === todo.id ? (
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <TextField
                      fullWidth
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSaveEdit(todo.id)}
                    >
                      {t('todos.save')}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                    >
                      {t('todos.cancel')}
                    </Button>
                  </Box>
                ) : (
                  <>
                    <ListItemText
                      primary={todo.text}
                      secondary={`${t('todos.priority')}: ${t(
                        `todos.${todo.priority}`
                      )}`}
                      sx={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleEditTodo(todo)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => dispatch(deleteTodo(todo.id))}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default TodoList; 