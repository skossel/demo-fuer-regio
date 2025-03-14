import React from 'react';
import { List } from '@mui/material';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onEdit, onDelete }) => {
    return (
        <List>
            {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </List>
    );
};

export default TodoList;
