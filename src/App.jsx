import React from "react";
import { Link } from "react-router-dom";
import "./mainpage.css";
import Header from "./Header";

const App = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex flex-col items-center justify-center p-6 text-yellow-300">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-wide neon-text animate-pulse mt-20 text-center">
          🎰 Tambola Arena 🎲
        </h1>

        <p className="text-base sm:text-lg mb-10 text-purple-500 tracking-wide text-center italic px-2">
          The ultimate online multiplayer tambola experience!
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-center">
          <Link
            to="/host/generatetickets"
            className="bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl shadow-md hover:bg-yellow-300 hover:scale-105 transition-all duration-300 border-2 border-yellow-500 text-center w-64 sm:w-auto"
          >
            🎟️ Generate Tickets
          </Link>
          <Link
            to="/player/gamestart"
            className="bg-green-400 text-black font-bold py-3 px-6 rounded-xl shadow-md hover:bg-green-300 hover:scale-105 transition-all duration-300 border-2 border-green-500 text-center w-64 sm:w-auto"
          >
            🧑‍🤝‍🧑 Join Game
          </Link>
        </div>

        <p className="mt-12 text-sm text-yellow-500 font-mono animate-pulse text-center">
          ⚡ Bet. Play. Win. Repeat. ⚡
        </p>
      </div>
    </>
  );
};

export default App;
