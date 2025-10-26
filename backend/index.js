const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;
require('./models/dbConnection');
const cors = require('cors');

const http = require('http');
const { Server } = require("socket.io");

const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRoutes');
const projectRouter = require('./routes/projectRoutes');
const taskRouter = require('./routes/taskRoutes');

// --- CORS CONFIGURATION USING ENV VARIABLE ---
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello from Enterprise Task Portal Backend!");
});

app.use('/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log(`[SOCKET] User Connected: ${socket.id}`);

  socket.on("error", (error) => {
    console.error(`[SOCKET] Error for user ${socket.id}:`, error);
  });

  socket.on("joinRoom", (projectId) => {
    if (!projectId) {
        console.warn(`[SOCKET] User ${socket.id} tried to join undefined room.`);
        return;
    }
    socket.join(projectId);
    console.log(`[SOCKET] User ${socket.id} joined room ${projectId}`);
  });

  socket.on("sendMessage", (data) => {
    if (!data || !data.projectId || !data.message || !data.author) {
        console.warn(`[SOCKET] Received incomplete message data from ${socket.id}:`, data);
        return;
    }
    console.log(`[SOCKET] Received message for room ${data.projectId}:`, data);
    socket.to(data.projectId).emit("receiveMessage", data);
    console.log(`[SOCKET] Broadcasted message to room ${data.projectId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[SOCKET] User Disconnected: ${socket.id}. Reason: ${reason}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server (with Socket.io) is running on ${PORT}`);
});