import { io } from 'socket.io-client';

const serverUrl = 'https://spygame-mzqu.onrender.com';
// import.meta.env.VITE_SOCKET_URL ||
console.log('Environment variable VITE_SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);

console.log('Connecting to server at:', serverUrl);
const socket = io(serverUrl, {
  transports: ['websocket']
});

// Verify connection
socket.on('connect', () => {
  console.log('Connected to Socket.io server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.io server');
});

export default socket;

