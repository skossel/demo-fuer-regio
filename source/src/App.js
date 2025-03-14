import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);

    // Alle Todos abrufen
    const fetchTodos = async () => {
        try {
            const todos = await window.api.getTodos();
            setTodos(todos);
        } catch (err) {
            console.error("Fehler beim Abrufen der Todos", err);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const addTodo = async (todo) => {
        try {
            const newTodo = await window.api.addTodo(todo);
            setTodos([...todos, newTodo]);
        } catch (err) {
            console.error("Fehler beim Hinzufuegen", err);
        }
    };

    const updateTodo = async (todo) => {
        try {
            await window.api.updateTodo(todo);
            setTodos(todos.map(t => t.id === todo.id ? todo : t));
            setEditingTodo(null);
        } catch (err) {
            console.error("Fehler beim Aktualisieren", err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const deletedId = await window.api.deleteTodo(id);
            if (deletedId !== null) {
                setTodos(todos.filter(t => t.id !== id));
            }
        } catch (err) {
            console.error("Fehler beim Loeschen", err);
        }
    };

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" align="center" gutterBottom>
                    Todo App
                </Typography>
                <TodoForm
                    addTodo={addTodo}
                    editingTodo={editingTodo}
                    updateTodo={updateTodo}
                    cancelEdit={() => setEditingTodo(null)}
                />
                <TodoList
                    todos={todos}
                    onEdit={(todo) => setEditingTodo(todo)}
                    onDelete={deleteTodo}
                />
            </Box>
        </Container>
    );
};

export default App;
