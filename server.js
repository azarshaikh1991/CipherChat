const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// User sockets mapping tracker
const userSockets = {};

io.on('connection', (socket) => {
    socket.on('register', (username) => {
        userSockets[username] = socket.id;
    });

    socket.on('privateMessage', (data) => {
        const { sender, recipient, message } = data;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageData = { sender, recipient, message, timestamp };
        if (userSockets[recipient]) {
            io.to(userSockets[recipient]).emit('privateMessage', messageData);
        }
        if (userSockets[sender]) {
            io.to(userSockets[sender]).emit('privateMessage', messageData);
        }
    });

    socket.on('disconnect', () => {
        for (let username in userSockets) {
            if (userSockets[username] === socket.id) {
                delete userSockets[username];
                break;
            }
        }
    });
});

// Image Upload API Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const { sender, recipient } = req.body;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messageData = {
            sender,
            recipient,
            message: `<img src="${imageUrl}" style="max-width: 250px; border-radius: 8px; display: block; margin-top: 5px;">`,
            timestamp
        };

        if (userSockets[recipient]) {
            io.to(userSockets[recipient]).emit('privateMessage', messageData);
        }
        if (userSockets[sender]) {
            io.to(userSockets[sender]).emit('privateMessage', messageData);
        }

        res.status(200).json({ success: true, imageUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
