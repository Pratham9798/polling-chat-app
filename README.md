# Real-time Polling and Chat Application

## Project Setup

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)


### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Pratham9798/polling-chat-app.git
    cd realtime-polling-app
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Running the Application

1. Start the Node.js server:

    ```bash
    npm start
    ```

2. Open your web browser and navigate to `http://localhost:3000`.

### Project Structure

- `server.js`: Main server file handling routes and WebSocket connections.
- `public/`: Directory containing static files (HTML, CSS, client-side JavaScript).
  - `index.html`: Main HTML file for the application.
  - `styles.css`: CSS file for styling the application.
  - `script.js`: Client-side JavaScript for handling UI interactions and WebSocket communication.

### Dependencies

- Express: Fast, unopinionated, minimalist web framework for Node.js.
- Socket.IO: Enables real-time bidirectional event-based communication.
- Mongoose: Elegant MongoDB object modeling for Node.js (optional).

### Features

- Real-time voting system.
- Real-time chat with user authentication.
- Typing indicator (optional).
- Edit and delete chat messages (optional).
- Persistent user profiles and message history (optional).
- Mute/Unmute chat notifications (optional).

