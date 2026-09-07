const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Static folder enable karein taaki uploaded images browser par dikh sakein
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage configuration
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

        // Recipient ko live image bhejien agar online hai
        if (userSockets && userSockets[recipient]) {
            io.to(userSockets[recipient]).emit('privateMessage', messageData);
        }
        // Sender ko bhi wapas bhejien taaki chat box mein show ho
        if (userSockets && userSockets[sender]) {
            io.to(userSockets[sender]).emit('privateMessage', messageData);
        }

        res.status(200).json({ success: true, imageUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
