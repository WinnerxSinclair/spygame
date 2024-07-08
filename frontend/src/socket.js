import { io } from 'socket.io-client';

// Replace with your Render backend URL
const socket = io('https://spygame-mzqu.onrender.com');

// Verify connection
socket.on('connect', () => {
  console.log('Connected to Socket.io server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.io server');
});

export default socket;
