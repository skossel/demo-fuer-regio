const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let db;

// Datenbank initialisieren – wie der Grundstein beim Hausbau
function initDatabase() {
    const dbPath = path.join(app.getPath('userData'), 'todos.db');
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error("Fehler beim Oeffnen der Datenbank", err);
        } else {
            console.log("Datenbank geoeffnet unter:", dbPath);
            db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
      )`);
        }
    });
}

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile(path.join(__dirname, 'public', 'index.html'));
}

app.whenReady().then(() => {
    initDatabase();
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// CRUD-Operationen via IPC

// Alle Todos abfragen
ipcMain.handle('getTodos', () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM todos", [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
});

// Neues Todo anlegen
ipcMain.handle('addTodo', (event, todo) => {
    return new Promise((resolve, reject) => {
        const { title, description } = todo;
        db.run("INSERT INTO todos (title, description) VALUES (?, ?)", [title, description], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, title, description });
            }
        });
    });
});

// Todo bearbeiten
ipcMain.handle('updateTodo', (event, todo) => {
    return new Promise((resolve, reject) => {
        const { id, title, description } = todo;
        db.run("UPDATE todos SET title = ?, description = ? WHERE id = ?", [title, description, id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(todo);
            }
        });
    });
});

// Todo loeschen (mit Sicherheitsdialog)
ipcMain.handle('deleteTodo', (event, id) => {
    return new Promise((resolve, reject) => {
        const response = dialog.showMessageBoxSync({
            type: 'warning',
            buttons: ['Abbrechen', 'Loeschen'],
            defaultId: 0,
            title: 'Loesch-Bestaetigung',
            message: 'Bist du sicher, dass du dieses Todo loeschen moechtest?'
        });
        if (response === 1) {
            db.run("DELETE FROM todos WHERE id = ?", [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(id);
                }
            });
        } else {
            resolve(null); // Loeschvorgang abgebrochen
        }
    });
});
