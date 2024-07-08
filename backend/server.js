const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Use CORS middleware
app.use(cors({
  origin: 'https://spy-app-997b6.web.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Add a basic route to verify server is running
app.get('/', (req, res) => {
  res.send('Backend is running');
});

const server = http.createServer(app);

// Set up Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: 'https://spy-app-997b6.web.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('New client connected'); // Log to verify connection
  socket.on('create_room', (name) => {
    const roomCode = generateUniqueCode();
    rooms[roomCode] = { players: [name], gameState: {} };
    socket.join(roomCode);
    socket.emit('room_created', roomCode);
    socket.emit('deez_nuts', rooms[roomCode].players);
  });

  socket.on('join_room', (roomCode, name) => {
    if (rooms[roomCode]) {
      rooms[roomCode].players.push(name);
      socket.join(roomCode);
      socket.emit('joined_room', roomCode);
      io.to(roomCode).emit('update_state', rooms[roomCode].gameState);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('game_action', (roomCode, action) => {
    if (rooms[roomCode]) {
      rooms[roomCode].gameState = performAction(rooms[roomCode].gameState, action);
      io.to(roomCode).emit('update_state', rooms[roomCode].gameState);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected'); // Log to verify disconnection
    for (const [roomCode, room] of Object.entries(rooms)) {
      room.players = room.players.filter(id => id !== socket.id);
      if (room.players.length === 0) {
        delete rooms[roomCode];
      }
    }
  });
});

function generateUniqueCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

function performAction(gameState, action) {
  // Implement your game logic here
  return gameState;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
