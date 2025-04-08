const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // ✅ Use "root" since it's the available user
    password: '12345654321',  // ✅ Leave empty if root has no password
    database: 'student_db'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to handle student form submission
app.post('/submit', (req, res) => {
    console.log('Received form submission:', req.body); // Log the received data
    const { name, age, email, course } = req.body;
    if (!name || !age || !email || !course) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = 'INSERT INTO students (name, age, email, course) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, age, email, course], (err, result) => {
        if (err) {
            console.error('Error inserting student:', err); // Log any database errors
            return res.status(500).json({ message: 'Failed to add student' });
        }
        res.status(201).json({ message: 'Student added successfully' });
    });
});

// Route to retrieve all students
app.get('/students', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) {
            console.error('Error retrieving students:', err); // Log any database errors
            return res.status(500).json({ message: 'Failed to retrieve students' });
        }
        console.log('Retrieved students:', results); // Log the retrieved data
        res.json(results); // Ensure the results are sent as JSON
    });
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
