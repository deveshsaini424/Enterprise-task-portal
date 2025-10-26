const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;
require('./models/dbConnection'); // Ensure this file exists and connects to Mongo
const cors = require('cors');

// --- Socket.io Imports ---
const http = require('http');
const { Server } = require("socket.io");
// --- End Socket.io Imports ---

// Route Imports - ENSURE THESE FILES EXIST IN ./routes AND EXPORT CORRECTLY
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRoutes');
const projectRouter = require('./routes/projectRoutes');
const taskRouter = require('./routes/taskRoutes');

app.use(cors()); // Enable CORS for all origins (adjust if needed for production)
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.send("Hello from Enterprise Task Portal Backend!"); // Updated message
});

// API Routes
app.use('/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

// --- Create HTTP Server for Socket.io ---
// Socket.io needs to attach to Node's native http server, not just Express app
const httpServer = http.createServer(app);

// --- Create Socket.io Server ---
// Configure CORS specifically for Socket.io connections
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Allow connections ONLY from your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"] // Allow necessary HTTP methods
  }
});

// --- Socket.io Connection Logic (WITH DEBUG LOGS) ---
io.on("connection", (socket) => {
  console.log(`[SOCKET] User Connected: ${socket.id}`); // Log connection

  // --- ADDED: General Error Listener ---
  socket.on("error", (error) => {
    console.error(`[SOCKET] Error for user ${socket.id}:`, error);
  });
  // --- END ADDED ---

  // User joins a project room
  socket.on("joinRoom", (projectId) => {
    if (!projectId) {
        console.warn(`[SOCKET] User ${socket.id} tried to join undefined room.`);
        return;
    }
    socket.join(projectId);
    console.log(`[SOCKET] User ${socket.id} joined room ${projectId}`); // Log room join
  });

  // User sends a message - Ensure this listener is active
  socket.on("sendMessage", (data) => {
    // Basic validation
    if (!data || !data.projectId || !data.message || !data.author) {
        console.warn(`[SOCKET] Received incomplete message data from ${socket.id}:`, data);
        return;
    }
    console.log(`[SOCKET] Received message for room ${data.projectId}:`, data); // Log received message
    // Broadcast the message to everyone *else* in that specific project room
    // Use io.to(...) to send to all including sender if needed
    socket.to(data.projectId).emit("receiveMessage", data); 
    // If you want sender to also receive via socket, use: io.to(data.projectId).emit(...)
    console.log(`[SOCKET] Broadcasted message to room ${data.projectId}`); // Log broadcast
  });

  socket.on("disconnect", (reason) => { // Added reason
    console.log(`[SOCKET] User Disconnected: ${socket.id}. Reason: ${reason}`); // Log disconnection
  });
});
// --- End Socket.io Logic ---


// --- Start the HTTP Server (NOT app.listen) ---
// We start the httpServer which includes both Express and Socket.io
httpServer.listen(PORT, () => {
  console.log(`Server (with Socket.io) is running on ${PORT}`);
});

