const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const PORT = 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

let grid = Array(10)
  .fill()
  .map(() => Array(10).fill(null));
let playerCount = 0;
let updateHistory = [];

io.on("connection", (socket) => {
  playerCount++;
  io.emit("playerCount", playerCount);

  socket.emit("gridUpdate", grid);
  socket.emit("updateHistory", updateHistory);

  socket.on("updateGrid", ({ x, y, character }) => {
    if (!grid[x][y]) {
      const timestamp = new Date().toLocaleTimeString();
      grid[x][y] = character;

      // Track the history of updates
      updateHistory.push({ x, y, character, timestamp });

      // updated grid and history to all players
      io.emit("gridUpdate", grid);
      io.emit("updateHistory", updateHistory);
    }
  });

  socket.on("disconnect", () => {
    playerCount--;
    io.emit("playerCount", playerCount);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
