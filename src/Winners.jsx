import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendURL } from './config';
import ContactButtons from "./ContactButtons";

const Winners = () => {
  const [winners, setWinners] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/getwinners`);
        console.log(response.data);
        setWinners(response.data);
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  if (loading)
    return <div className="text-yellow-300 text-xl text-center mt-10 animate-pulse">🎰 Loading Winners...</div>;
  if (!winners)
    return <div className="text-yellow-300 text-xl text-center mt-10">No winners found. 🃏</div>;

  const displayMap = {
    fullHouse: 'Full House',
    topLine: 'Top Line',
    middleLine: 'Middle Line',
    bottomLine: 'Bottom Line',
    fourCorners: 'Four Corners',
    earlyFive: 'Early Five',
    earlySeven: 'Early Seven'
  };

  return (
    <div className="winners-container min-h-screen flex flex-col items-center justify-start py-10 px-4 w-full">
      {/* Return Button */}

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-extrabold mb-12 neon-text text-center mt-16">
        🏆 TAMBOLA CHAMPIONS 🏆
      </h2>

      {/* Winners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {Object.entries(displayMap).map(([key, label]) => {
          if (winners[key]?.length > 0) {
            return (
              <div
                key={key}
                className="bg-black bg-opacity-60 p-6 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 border border-purple-400 backdrop-blur animated-gradient"
              >
                <h3 className="text-2xl font-bold text-purple-700 mb-3 sparkle">{label}</h3>
                <p className="text-lg text-yellow-300 font-bold">{winners[key].join(', ')}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
      <ContactButtons />
    </div>
  );
};

export default Winners;
