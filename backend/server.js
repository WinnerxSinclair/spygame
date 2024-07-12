const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs')

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

const locations = JSON.parse(fs.readFileSync('locations.json', 'utf8'));
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
      if(rooms[roomCode].players.length>=8){
        socket.emit('error', 'too many players');
        return;
      }else{
        rooms[roomCode].players.push(name);
      }
      socket.join(roomCode);
      socket.emit('joined_room', roomCode);
      console.log('here')
      io.to(roomCode).emit('update_players', rooms[roomCode].players);
      console.log('Player list updated for room:', roomCode);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('start_game', (roomCode) => {
    io.to(roomCode).emit('route_game');
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const shuffledRoles = shuffleArray(randomLocation.roles);
    const players = rooms[roomCode].players;
    const spyIndex = Math.floor(Math.random() * players.length);

    const playerRoles = players.map((player, index) => ({
      player,
      role: index === spyIndex ? 'spy' : shuffledRoles[index % shuffledRoles.length]
    }));

    io.to(roomCode).emit('load_game', {
      location: randomLocation.name,
      roles: playerRoles
    });
  })

  socket.on('restart_game', (roomCode)=>{
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const shuffledRoles = shuffleArray(randomLocation.roles);
    const players = rooms[roomCode].players;
    const spyIndex = Math.floor(Math.random() * players.length);

    const playerRoles = players.map((player, index) => ({
      player,
      role: index === spyIndex ? 'spy' : shuffledRoles[index % shuffledRoles.length]
    }));

    io.to(roomCode).emit('load_game', {
      location: randomLocation.name,
      roles: playerRoles
    });
  })

  socket.on('lobby_return', (roomCode)=>{
    io.to(roomCode).emit('lobby_returnfs');
    io.to(roomCode).emit('update_players', rooms[roomCode].players);
  })

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
  return Math.random().toString(36).substr(2, 5).toUpperCase();
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function performAction(gameState, action) {
  // Implement your game logic here
  return gameState;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// socket.on('game_action', (roomCode, action) => {
//   if (rooms[roomCode]) {
//     rooms[roomCode].gameState = performAction(rooms[roomCode].gameState, action);
//     io.to(roomCode).emit('update_state', rooms[roomCode].gameState);
//   }
// });