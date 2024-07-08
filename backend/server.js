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
app.get('/', (req, res) => {
  res.send('Backend is running');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://spy-app-997b6.web.app', 
    methods: ['GET', 'POST']
  }
});

const rooms = {};

io.on('connection', (socket) => {
  socket.on('create_room', () => {
    const roomCode = generateUniqueCode();
    rooms[roomCode] = { players: [socket.id], gameState: {} };
    socket.join(roomCode);
    socket.emit('room_created', roomCode);
  });

  socket.on('join_room', (roomCode) => {
    if (rooms[roomCode]) {
      rooms[roomCode].players.push(socket.id);
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
