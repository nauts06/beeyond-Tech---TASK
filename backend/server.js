// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', productRoutes);




// Health check endpoint
app.get('/api/health', (req, res) => res.send('API is healthy'));

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Global orderStatus tracking map
const activeSockets = new Map();

// Socket.io logic
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join specific room for a user (order tracking)
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(orderId);
    console.log(`Socket ${socket.id} joined room: ${orderId}`);
  });

  // Delivery partner updates status
  socket.on('orderStatusUpdate', ({ orderId, status }) => {
    // Broadcast status to the room
    io.to(orderId).emit('orderStatusUpdate', { orderId, status });
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Attach io to app for controller access
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
