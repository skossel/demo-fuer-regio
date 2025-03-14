const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getTodos: () => ipcRenderer.invoke('getTodos'),
    addTodo: (todo) => ipcRenderer.invoke('addTodo', todo),
    updateTodo: (todo) => ipcRenderer.invoke('updateTodo', todo),
    deleteTodo: (id) => ipcRenderer.invoke('deleteTodo', id)
});
