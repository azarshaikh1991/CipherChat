const express = require('express');
const app = express(); // Yeh line hamesha sabse upar honi chahiye
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ab yahan safe tareeqe se app.use use karein
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
