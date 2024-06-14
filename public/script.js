const socket = io();

const pollOptionsDiv = document.getElementById('poll-options');
const chatMessagesDiv = document.getElementById('chat-messages');
const typingIndicatorDiv = document.getElementById('typing-indicator');
const chatInput = document.getElementById('chat-input');
const resultButton = document.getElementById('result-button');
const sendButton = document.getElementById('send-button');
const pollChartCanvas = document.getElementById('poll-chart').getContext('2d');

let username = prompt('Enter your name:') || 'Anonymous';
let showResults = false;

// Initial data received from server
socket.on('initialData', ({ pollOptions, chatMessages }) => {
  updatePollOptions(pollOptions);
  chatMessages.forEach(addChatMessage);
});

// Update poll options when received from server
socket.on('updatePoll', (pollOptions) => {
  updatePollOptions(pollOptions);
});

// Initialize Chart.js bar chart
let pollChart = new Chart(pollChartCanvas, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Votes',
      data: [],
      backgroundColor: 'rgba(0, 123, 255, 0.5)',
      borderColor: 'rgba(0, 123, 255, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Update UI with current poll options and vote counts
function updatePollOptions(pollOptions) {
  const labels = Object.keys(pollOptions);
  const data = Object.values(pollOptions);

  pollChart.data.labels = labels;
  pollChart.data.datasets[0].data = data;
  pollChart.update();

  // Also update the poll options div
  pollOptionsDiv.innerHTML = '';
  Object.entries(pollOptions).forEach(([option, count]) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'poll-option';
    optionDiv.innerHTML = `
      <span>${option}</span>
      <span>${count} votes</span>
    `;
    optionDiv.addEventListener('click', () => {
      voteForOption(option);
    });
    pollOptionsDiv.appendChild(optionDiv);
  });
}

// Function to emit a vote event to the server
function voteForOption(option) {
  socket.emit('vote', option);
}

// Function to add chat message to the UI
socket.on('newMessage', addChatMessage);

function addChatMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message';
  messageDiv.setAttribute('data-id', message.id);
  messageDiv.innerHTML = `
    <span>${message.username}: ${message.text}</span>
    <button class="edit-button">Edit</button>
    <button class="delete-button">Delete</button>
  `;
  chatMessagesDiv.appendChild(messageDiv);
  chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;

  // Attach event listeners for edit and delete buttons
  messageDiv.querySelector('.edit-button').addEventListener('click', () => editMessage(message.id));
  messageDiv.querySelector('.delete-button').addEventListener('click', () => deleteMessage(message.id));
}

// Handle sending chat messages
sendButton.addEventListener('click', () => {
  const text = chatInput.value.trim();
  if (text !== '') {
    socket.emit('chatMessage', { username, text });
    chatInput.value = '';
  }
});

// Handle editing messages
function editMessage(messageId) {
  const messageDiv = document.querySelector(`.chat-message[data-id="${messageId}"]`);
  const newText = prompt('Edit your message:', messageDiv.querySelector('span').textContent.split(': ')[1]);
  if (newText) {
    const editedMessage = { id: messageId, text: newText, username };
    socket.emit('editMessage', editedMessage);
  }
}

// Handle deleting messages
function deleteMessage(messageId) {
  if (confirm('Are you sure you want to delete this message?')) {
    socket.emit('deleteMessage', messageId);
  }
}

// Update UI when a message is edited
socket.on('messageEdited', (editedMessage) => {
  const messageDiv = document.querySelector(`.chat-message[data-id="${editedMessage.id}"]`);
  if (messageDiv) {
    messageDiv.querySelector('span').textContent = `${editedMessage.username}: ${editedMessage.text}`;
  }
});

// Update UI when a message is deleted
socket.on('messageDeleted', (messageId) => {
  const messageDiv = document.querySelector(`.chat-message[data-id="${messageId}"]`);
  if (messageDiv) {
    messageDiv.remove();
  }
});

// Handle typing indicator
chatInput.addEventListener('input', () => {
  socket.emit('typing', username);
});

socket.on('typing', (username) => {
  typingIndicatorDiv.textContent = `${username} is typing...`;
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    typingIndicatorDiv.textContent = '';
  }, 2000);
});

let typingTimeout;

// Toggle showing results
resultButton.addEventListener('click', () => {
  showResults = !showResults;
  pollChartCanvas.parentElement.style.display = showResults ? 'block' : 'none';
  resultButton.textContent = showResults ? 'Hide Results' : 'Show Results';
});





