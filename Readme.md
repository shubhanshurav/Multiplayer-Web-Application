# Multiplayer Grid Web Application

This is a multiplayer web application where players can select and update a block with a Unicode character on a 10x10 grid. The grid is updated in real-time for all connected players. Once a player submits a character, they are restricted from playing again for 1 minute. Players can also see a history of updates made to the grid. The player count is shown at the top.

## Features
- **Real-Time Grid Updates**: The grid is updated in real-time for all players.
- **Player Count**: Displays the number of players currently online.
- **Timed Restriction**: After a player submits a character, they are restricted from playing for 1 minute.
- **Historical Updates**: Players can view all past updates made to the grid, with timestamps.

## Tech Stack
- **Frontend**: ReactJS, Tailwind CSS
- **Backend**: NodeJS, Express, Socket.IO
- **Deployment**: Vercel (for frontend), Render (for backend)


## Setup Instructions

### Prerequisites
- **Node.js** 
- **npm**  package manager
- **React** (for frontend development)

### Step 1: Clone the repository
```bash
git clone https://github.com/your-username/multiplayer-grid-app.git

```

### Step 2: Set up the backend
```
1. Navigate to the server folder:

    cd server

2. Install the dependencies:

    npm install

3. Start the Server:

    npm start
```

### Step 3: Set up the frontend
```
1. Navigate to the client folder:

    cd multiplayer-web-application

2. Install the dependencies:

    npm install

3. Create a .env file in the client directory with the following content:

    REACT_APP_BACKEND_URL= BACKEND_URL || http://localhost:5000

4. Start the frontend:

    npm start

```