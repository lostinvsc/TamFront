import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./mainpage.css";
import Header from "./Header";
import ContactButtons from "./ContactButtons";

const App = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);

  const closePopup = () => setShowPopup(false);
  const openCertificate = () => setShowCertificate(true);
  const closeCertificate = () => setShowCertificate(false);

  return (
    <>
      <Header />

      {/* Main Announcement Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50 px-4">
          <div className="border text-white bg-zinc-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-2 text-red-600">‼️ Announcement ‼️</h2>
            <p className="mb-4 text-xl">
              Tambola is a legal game in India and falls under a skill-based game.
              This website is provided by <strong>starttambola.com</strong> and 
              <strong> oncdigital.in</strong> certified. It's a legit website in terms of gaming results. 
              Remember <strong>starttambola.com</strong> is an app provider and not an owner of this app. <br />
              <button
                onClick={openCertificate}
                className="underline text-blue-400 hover:text-blue-500 transition"
              >
                Check certificate by clicking here
              </button>.
            </p>
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Okay
            </button>
          </div>
        </div>
      )}

{showCertificate && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] px-4">
    <div className="relative bg-black p-2 rounded-lg shadow-xl max-w-md w-full">
      <img
        src="/certificate.jpeg"
        alt="Certificate"
        className="rounded mx-auto max-w-[90%] max-h-[70vh] object-contain"
      />
      <button
        onClick={closeCertificate}
        className="absolute -top-5  right-3 text-white text-2xl font-bold hover:text-red-600"
      >
        ×
      </button>
    </div>
  </div>
)}

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex flex-col items-center justify-center p-6 text-yellow-300">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-wide neon-text animate-pulse text-center">
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
            <Link
            to="/player/buytickets"
            className="bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl shadow-md hover:bg-yellow-300 hover:scale-105 transition-all duration-300 border-2 border-yellow-500 text-center w-64 sm:w-auto"
          >
            Buy Tickets
          </Link>
        </div>

        <p className="mt-12 text-sm text-yellow-500 font-mono animate-pulse text-center">
          ⚡ Bet. Play. Win. Repeat. ⚡
        </p>
      </div>

      <ContactButtons/>
    </>
  );
};

export default App;
