import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./index.css";
// const socket = io("http://localhost:5000");
const socket = io("https://multiplayer-web-application.onrender.com");

const App = () => {
  const [grid, setGrid] = useState(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill(null))
  );

  console.log("socket", socket)
  const [playerCount, setPlayerCount] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    socket.on("initializeGrid", (serverGrid) => {
      setGrid(serverGrid);
    });

    socket.on("updateGrid", ({ row, col, character }) => {
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[row][col] = character;
        return newGrid;
      });
    });

    socket.on("updatePlayerCount", (count) => {
      setPlayerCount(count);
    });

    return () => {
      socket.off("initializeGrid");
      socket.off("updateGrid");
      socket.off("updatePlayerCount");
    };
  }, []);

  const handleBlockClick = (row, col) => {
    if (!hasPlayed && !grid[row][col]) {
      const character = prompt("Enter a Unicode character:");
      if (character) {
        socket.emit("submitCharacter", { row, col, character });
        setHasPlayed(true);
      }
    }
  };

  return (
    <div className="h-screen bg-gray-800 flex flex-col justify-center items-center py-10">
      <h1 className="text-4xl text-white mb-6">Multiplayer Grid Game</h1>
      <div className="text-white mb-4">Players Online: {playerCount}</div>
      <div className="grid grid-cols-10 gap-1">
        {grid.map((row, rowIndex) =>
          row.map((block, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-16 h-16 bg-gray-600 text-white flex justify-center items-center border border-gray-700 cursor-pointer text-xl"
              onClick={() => handleBlockClick(rowIndex, colIndex)}
            >
              {block || ""}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
