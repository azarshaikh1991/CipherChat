const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const SECRET_KEY = 'arzo_super_secret_key';
const users = {}; // In-memory DB for registered users
const onlineUsers = {}; // Map username -> socket.id

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

// WebSocket Logic for Private Chat
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // User joins with their username
    socket.on('join', (username) => {
        if (username) {
            onlineUsers[username] = socket.id;
            socket.username = username;
            // Broadcast updated online users list to everyone
            io.emit('online-users', Object.keys(onlineUsers));
        }
    });

    // Handle Private/Direct Messages
    socket.on('privateMessage', ({ recipient, message, sender }) => {
        const recipientSocketId = onlineUsers[recipient];
        const messageData = { sender, message, timestamp: new Date().toLocaleTimeString() };

        if (recipientSocketId) {
            // Send to recipient
            io.to(recipientSocketId).emit('privateMessage', messageData);
        }
        // Also send back to sender so it shows in their chat window
        socket.emit('privateMessage', messageData);
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
        if (socket.username && onlineUsers[socket.username]) {
            delete onlineUsers[socket.username];
            io.emit('online-users', Object.keys(onlineUsers));
        }
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Arzo Server running on http://localhost:${PORT}`);
});
