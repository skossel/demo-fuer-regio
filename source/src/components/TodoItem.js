import React from 'react';
import { ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TodoItem = ({ todo, onEdit, onDelete }) => {
    return (
        <ListItem
            secondaryAction={
                <>
                    <IconButton edge="end" aria-label="edit" onClick={() => onEdit(todo)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => onDelete(todo.id)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            }
        >
            <ListItemText primary={todo.title} secondary={todo.description} />
        </ListItem>
    );
};

export default TodoItem;
