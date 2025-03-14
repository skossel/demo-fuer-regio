import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

const TodoForm = ({ addTodo, editingTodo, updateTodo, cancelEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (editingTodo) {
            setTitle(editingTodo.title);
            setDescription(editingTodo.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [editingTodo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return; // Titel ist Pflicht
        if (editingTodo) {
            updateTodo({ id: editingTodo.id, title, description });
        } else {
            addTodo({ title, description });
        }
        setTitle('');
        setDescription('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} mb={2}>
            <TextField
                label="Titel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                label="Bemerkung"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Box mt={2} display="flex" justifyContent="space-between">
                {editingTodo && (
                    <Button variant="contained" color="secondary" onClick={cancelEdit}>
                        Abbrechen
                    </Button>
                )}
                <Button variant="contained" color="primary" type="submit">
                    {editingTodo ? 'Aktualisieren' : 'Hinzufuegen'}
                </Button>
            </Box>
        </Box>
    );
};

export default TodoForm;
