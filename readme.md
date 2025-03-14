# Todo Listen App

## Beschreibung
Dies ist eine Desktop-App, in der du Todo-Items (mit Titel und Bemerkung) erstellen, bearbeiten, löschen und anzeigen kannst. Die App basiert auf React, Material UI, Electron und SQLite.

## Installation und Start
1. **Voraussetzungen:**
    - Node.js und npm müssen installiert sein.
2. **Installation:**
    - Navigiere in den Ordner `source` und führe aus:
      ```
      npm install
      ```
3. **Start im Entwicklungsmodus:**
    - Baue das Bundle und starte die App:
      ```
      npm run start
      ```
4. **Erstellen einer ausführbaren .exe:**
    - Führe folgenden Befehl aus, um die App zu packen:
      ```
      npm run build
      ```
    - Die generierte .exe-Datei findest du dann im entsprechenden Ausgabeverzeichnis. Verschiebe sie in den Ordner `executable`.

## Hinweise
- Die App nutzt Electron IPC, um zwischen Renderer (React) und Main (Electron + SQLite) zu kommunizieren.
- Beim Löschen wird zur Sicherheit ein Bestätigungsdialog angezeigt.
- Alle UI-Komponenten basieren auf Material UI.

Viel Spass beim Basteln – so wie beim Zusammenbau eines genialen Lego-Modells!
# demo-fuer-regio
