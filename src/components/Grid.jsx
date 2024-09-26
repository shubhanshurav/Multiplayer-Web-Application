import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_DETAILS = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
// const SOCKET_DETAILS =  "http://localhost:5000";
const socket = io(SOCKET_DETAILS);
// console.log(SOCKET_DETAILS)

const Grid = () => {
  const [grid, setGrid] = useState(
    Array(10)
      .fill()
      .map(() => Array(10).fill(null))
  );
  const [playerCount, setPlayerCount] = useState(0);
  const [canPlay, setCanPlay] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [updateHistory, setUpdateHistory] = useState([]);

  useEffect(() => {
    socket.on("gridUpdate", (updatedGrid) => {
      setGrid(updatedGrid);
    });

    socket.on("playerCount", (count) => {
      setPlayerCount(count);
    });

    socket.on("updateHistory", (history) => {
      setUpdateHistory(history);
    });
  }, []);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setCanPlay(true);
    }
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleBlockClick = (x, y) => {
    if (canPlay && !grid[x][y]) {
      const character = prompt("Enter a Unicode character:");
      if (character) {
        socket.emit("updateGrid", { x, y, character });
        setCanPlay(false);
        setTimeRemaining(60); // Set 1 minute restriction
      }
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center bg-gray-900">
      {/* Grid Section */}
      <div className="flex flex-col items-center">
        <div className="text-white mb-4">Players online: {playerCount}</div>
        <div className="grid grid-cols-10 gap-2">
          {grid.map((row, rowIndex) =>
            row.map((block, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-10 h-10 flex items-center justify-center border border-gray-600 
                  ${block ? "bg-green-500" : "bg-gray-700"} 
                  cursor-pointer text-white`}
                onClick={() => handleBlockClick(rowIndex, colIndex)}
              >
                {block || ""}
              </div>
            ))
          )}
        </div>
        {!canPlay && (
          <div className="text-red-500 mt-4">
            You can update again in: {timeRemaining} seconds
          </div>
        )}
      </div>

      {/* Rules Section */}
      <div className="ml-10 text-white">
        <h2 className="text-3xl font-bold mb-4">Game Rules</h2>
        <ul className="text-lg list-disc pl-6 space-y-2">
          <li className="text-yellow-400 font-semibold">Select any block only once.</li>
          <li className="text-blue-400 font-semibold">Input any Unicode character.</li>
          <li className="text-green-400 font-semibold">Once a block is filled, it cannot be changed.</li>
          <li className="text-red-400 font-semibold">Grid updates in real-time for all players.</li>
          <li className="text-purple-400 font-semibold">Player count is shown at the top.</li>
        </ul>

        {/* History Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Historical Updates</h2>
          <ul className="text-lg space-y-2">
            {updateHistory.map((update, index) => (
              <li key={index} className="text-gray-300">
                {`At ${update.timestamp}: Block (${update.x}, ${update.y}) was updated to '${update.character}'`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Grid;
