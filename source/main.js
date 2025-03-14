const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

let db;

// Ermittelt den Quellpfad der Datenbank (wird über extraFiles bereitgestellt)
function getDatabaseSourcePath() {
    if (app.isPackaged) {
        // Im gepackten Zustand befindet sich die Datenbank im resources-Ordner
        return path.join(process.resourcesPath, 'data', 'todos.db');
    } else {
        // Im Entwicklungsmodus relativ zum Projektverzeichnis
        return path.join(__dirname, 'data', 'todos.db');
    }
}

// Initialisiert die Datenbank:
// - Kopiert die Datenbank von extraFiles in ein beschreibbares Verzeichnis (userData),
//   falls sie dort noch nicht existiert.
// - Öffnet anschließend die Datenbank und erstellt ggf. die Tabelle
function initDatabase() {
    const targetPath = path.join(app.getPath('userData'), 'todos.db');
    const sourcePath = getDatabaseSourcePath();

    // Falls die Datenbank im userData-Verzeichnis nicht existiert, kopiere sie
    if (!fs.existsSync(targetPath)) {
        try {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Datenbank kopiert von ${sourcePath} nach ${targetPath}`);
        } catch (err) {
            console.error("Fehler beim Kopieren der Datenbank:", err);
        }
    } else {
        console.log(`Datenbank existiert bereits unter ${targetPath}`);
    }

    // Öffne die SQLite-Datenbank
    db = new sqlite3.Database(targetPath, (err) => {
        if (err) {
            console.error("Fehler beim Öffnen der Datenbank", err);
        } else {
            console.log("Datenbank geöffnet unter:", targetPath);
            db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
      )`);
        }
    });
}

// Erzeugt das Hauptfenster und lädt die index.html
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

// Todo löschen (mit Sicherheitsdialog)
ipcMain.handle('deleteTodo', (event, id) => {
    return new Promise((resolve, reject) => {
        const response = dialog.showMessageBoxSync({
            type: 'warning',
            buttons: ['Abbrechen', 'Löschen'],
            defaultId: 0,
            title: 'Lösch-Bestätigung',
            message: 'Bist du sicher, dass du dieses Todo löschen möchtest?'
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
            resolve(null); // Löschvorgang abgebrochen
        }
    });
});
