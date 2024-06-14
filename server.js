const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

// Store poll options and their vote counts
let pollOptions = {
  'JavaScript': 0,
  'Python': 0,
  'Java': 0,
  'C++': 0
};

// Store chat messages
let chatMessages = [];

// Serve static files from the public directory
app.use(express.static('public'));

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send initial data to the client
  socket.emit('initialData', { pollOptions, chatMessages });

  // Handle voting
  socket.on('vote', (option) => {
    if (pollOptions[option] !== undefined) {
      pollOptions[option]++;
      io.emit('updatePoll', pollOptions);
    }
  });

  // Handle chat messages
  socket.on('chatMessage', (message) => {
    message.id = uuidv4(); // Assign a unique ID to each message
    chatMessages.push(message);
    io.emit('newMessage', message);
  });

  // Handle editing messages
  socket.on('editMessage', (editedMessage) => {
    const messageIndex = chatMessages.findIndex(msg => msg.id === editedMessage.id);
    if (messageIndex !== -1) {
      chatMessages[messageIndex].text = editedMessage.text;
      io.emit('messageEdited', editedMessage);
    }
  });

  // Handle deleting messages
  socket.on('deleteMessage', (messageId) => {
    chatMessages = chatMessages.filter(msg => msg.id !== messageId);
    io.emit('messageDeleted', messageId);
  });

  // Handle typing indicator
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



