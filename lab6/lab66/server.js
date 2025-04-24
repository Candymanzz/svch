const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(bodyParser.json());

// Data files
const TABLES_FILE = path.join(__dirname, 'data', 'tables.json');
const RESERVATIONS_FILE = path.join(__dirname, 'data', 'reservations.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    try {
        fs.mkdirSync(path.join(__dirname, 'data'));
        console.log('Created data directory');
    } catch (error) {
        console.error('Failed to create data directory:', error);
        process.exit(1);
    }
}

// Initialize data files if they don't exist
if (!fs.existsSync(TABLES_FILE)) {
    try {
        fs.writeFileSync(TABLES_FILE, JSON.stringify([
            { id: 1, capacity: 2, available: true },
            { id: 2, capacity: 4, available: true },
            { id: 3, capacity: 6, available: true },
            { id: 4, capacity: 8, available: true }
        ]));
        console.log('Created tables.json');
    } catch (error) {
        console.error('Failed to create tables.json:', error);
        process.exit(1);
    }
}

if (!fs.existsSync(RESERVATIONS_FILE)) {
    try {
        fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify([]));
        console.log('Created reservations.json');
    } catch (error) {
        console.error('Failed to create reservations.json:', error);
        process.exit(1);
    }
}

// Helper function to read JSON files
const readJsonFile = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
};

// Helper function to write JSON files
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
};

// GET service for serving the frontend
app.get('/page', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// GET service for available tables
app.get('/tables', (req, res) => {
    const tables = readJsonFile(TABLES_FILE);
    if (tables) {
        res.json(tables);
    } else {
        res.status(500).json({ error: 'Failed to read tables data' });
    }
});

// POST service for creating a reservation
app.post('/reservations', (req, res) => {
    const { tableId, date, time, name, phone } = req.body;

    if (!tableId || !date || !time || !name || !phone) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const tables = readJsonFile(TABLES_FILE);
    const reservations = readJsonFile(RESERVATIONS_FILE);

    if (!tables || !reservations) {
        return res.status(500).json({ error: 'Failed to read data' });
    }

    const table = tables.find(t => t.id === tableId);
    if (!table) {
        return res.status(400).json({ error: 'Table not found' });
    }

    const reservationDate = new Date(date);
    if (reservationDate < new Date()) {
        return res.status(400).json({ error: 'Cannot book for past dates' });
    }

    const existingReservation = reservations.find(r =>
        r.tableId === tableId && r.date === date && r.time === time
    );

    if (existingReservation) {
        return res.status(400).json({ error: 'Table is already booked for this time' });
    }

    const newReservation = {
        id: reservations.length + 1,
        tableId,
        date,
        time,
        name,
        phone,
        createdAt: new Date().toISOString()
    };

    reservations.push(newReservation);
    if (writeJsonFile(RESERVATIONS_FILE, reservations)) {
        res.json(reservations);
    } else {
        res.status(500).json({ error: 'Failed to save reservation' });
    }
});

// GET service for reservations with format negotiation
app.get('/reservations', (req, res) => {
    const reservations = readJsonFile(RESERVATIONS_FILE);
    if (!reservations) {
        return res.status(500).json({ error: 'Failed to read reservations' });
    }

    const acceptHeader = req.headers.accept || 'application/json';

    if (acceptHeader.includes('application/xml')) {
        res.set('Content-Type', 'application/xml');
        res.send(convertToXML(reservations));
    } else if (acceptHeader.includes('text/html')) {
        res.set('Content-Type', 'text/html');
        res.send(convertToHTML(reservations));
    } else {
        res.json(reservations);
    }
});

// DELETE service for canceling a reservation
app.delete('/reservations/:id', (req, res) => {
    const reservations = readJsonFile(RESERVATIONS_FILE);
    if (!reservations) {
        return res.status(500).json({ error: 'Failed to read reservations' });
    }

    const reservationId = parseInt(req.params.id);
    const updatedReservations = reservations.filter(r => r.id !== reservationId);

    if (updatedReservations.length === reservations.length) {
        return res.status(404).json({ error: 'Reservation not found' });
    }

    if (writeJsonFile(RESERVATIONS_FILE, updatedReservations)) {
        res.json(updatedReservations);
    } else {
        res.status(500).json({ error: 'Failed to delete reservation' });
    }
});

// Helper functions for format conversion
function convertToXML(data) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<reservations>\n';
    data.forEach(reservation => {
        xml += `  <reservation>\n`;
        Object.entries(reservation).forEach(([key, value]) => {
            xml += `    <${key}>${value}</${key}>\n`;
        });
        xml += `  </reservation>\n`;
    });
    xml += '</reservations>';
    return xml;
}

function convertToHTML(data) {
    let html = '<!DOCTYPE html>\n<html>\n<head>\n<title>Reservations</title>\n</head>\n<body>\n';
    html += '<table border="1">\n<tr>\n';
    Object.keys(data[0] || {}).forEach(key => {
        html += `<th>${key}</th>\n`;
    });
    html += '</tr>\n';

    data.forEach(reservation => {
        html += '<tr>\n';
        Object.values(reservation).forEach(value => {
            html += `<td>${value}</td>\n`;
        });
        html += '</tr>\n';
    });

    html += '</table>\n</body>\n</html>';
    return html;
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 