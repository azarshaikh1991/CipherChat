const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const SECRET_KEY = 'arzo_super_secret_key';
const users = {}; // In-memory DB

app.use(express.json());
app.use(express.static('public'));

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    if (users[username]) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword };

    res.json({ message: 'Welcome to Arzo! Account created successfully.' });
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users[username];

    if (!user) return res.status(400).json({ error: 'User not found in Arzo' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, username });
});

// WebSocket Logic for Arzo
io.on('connection', (socket) => {
    socket.on('chatMessage', (data) => {
        io.emit('message', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Arzo Server running on http://localhost:${PORT}`);
});
