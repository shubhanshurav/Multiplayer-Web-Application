const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;

let grid = Array(10)
  .fill(null)
  .map(() => Array(10).fill(null)); // Initialize empty 10x10 grid
let onlinePlayers = 0;

io.on("connection", (socket) => {
  onlinePlayers++;
  io.emit("updatePlayerCount", onlinePlayers);

  // Send the current grid state to the new player
  socket.emit("initializeGrid", grid);

  socket.on("submitCharacter", ({ row, col, character }) => {
    if (!grid[row][col]) {
      grid[row][col] = character;
      io.emit("updateGrid", { row, col, character });
    }
  });

  socket.on("disconnect", () => {
    onlinePlayers--;
    io.emit("updatePlayerCount", onlinePlayers);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
