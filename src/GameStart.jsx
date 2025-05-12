import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported
import socket from './socket'; // Adjust path if needed
import useUnsavedChangesWarning from "./Dontleave.jsx";
import NavigationGuard from "./NavigationGuard";

const GameStart = () => {
  const [currentNumber, setCurrentNumber] = useState(null);
  const [numberHistory, setNumberHistory] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [leaving, setLeaving] = useState(false);
   const [voice, setVoice] = useState("");
   const [check, setCheck] = useState();

 useUnsavedChangesWarning(leaving);

const speakNumber = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);

  const voices = speechSynthesis.getVoices();
  

  // Define the filter based on selected voice type
  const preferredVoice = voices.find((v) => {
    const name = v.name.toLowerCase();
    const isEnglish = v.lang.includes("en");
 if(voice.length!=4) {
      return (
        isEnglish &&
        (name.includes("female") ||
         name.includes("woman") ||
         name.includes("samantha") ||      // macOS female voice
         name.includes("karen") ||         // macOS AU female
         name.includes("google us english"))
      );
      
    }
  });
if(voice.length==4){

  utterance.voice = preferredVoice || voices[0];
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.lang = 'en-US';
}else{
    utterance.voice = preferredVoice || voices[0];
  utterance.pitch = 1.2;
  utterance.rate = 1;
  utterance.lang = 'en-US';
}

  speechSynthesis.speak(utterance);
};

useEffect(() => {
  const getvoice = async () => {
    try {
      const res = await axios.get('https://tambola-ppuw.onrender.com/api/getvoice');

     
      setVoice(res.data.voice.voiceType);
    } catch (err) {
      console.error('Error fetching voice:', err);
    }
  };
  getvoice();
}, [check])

  // useEffect(() => {
  //   if(currentNumber!=null){
  //     speakNumber(currentNumber)
  //   }
  // }, [currentNumber])

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("number", (num) => {
      // console.log("New number received:", num);
      setCurrentNumber(num);
      setNumberHistory(prev => [...prev, num]);

      if (num != null) {
        speakNumber(num)
        setLeaving(true)
      }
      // Start the game when the first number is received
      if (numberHistory.length === 0) {
        setGameStarted(true); // Set gameStarted to true when first number is received
        fetchTickets(); // Call fetchTickets only the first time a number is received
      }
    });

    socket.on("game-over", () => {
        speakNumber("Game is now over, check winners")
        // setLeaving(false)
      setGameOver(true);
    });

    return () => {
      socket.off("number");
      socket.off("game-over");

    };
  }, [numberHistory]); // Add `numberHistory` to the dependency array

  const fetchTickets = async () => {
    try {
      const res = await axios.get('https://tambola-ppuw.onrender.com/api/getsoldtickets');
      const allTickets = res.data.tickets;
      setTickets(allTickets);
      // setVoice(res.data.voiceType);
      
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };



  return (
    <div className='h-screen w-full overflow-auto flex flex-col text-black mx-auto pb-16 px-4 sm:px-6 lg:px-8 animated-gradient'>
      <NavigationGuard when={leaving} message="If you leave, can't see this game later. Leave anyway?" />
      <Link
        to="/"
        className="bg-red-700 text-white px-4 py-2 rounded hover:bg-black transition w-fit my-8"
      >
        ← Return
      </Link>
      <div className="text-center mb-6">
        {gameStarted && !gameOver && (
          <div className="text-3xl font-extrabold text-yellow-400 animate-pulse drop-shadow-lg bg-gradient-to-r from-red-700 to-yellow-600 py-4 px-6 rounded-xl shadow-xl border-4 border-yellow-500 text-center">
            🎲 Game Started! See your tickets! 🎲
          </div>
        )}


        {!gameStarted &&
          <div className="text-2xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 py-4 px-6 rounded-lg shadow-lg border border-gray-600 animate-pulse">
            ⏳ Please wait for the next game to begin...
          </div>
        }
      </div>


      {gameOver ? (
        <div className="text-center mb-8">
          <div className="text-4xl font-extrabold text-yellow-400 mb-2 animate-bounce drop-shadow-xl">
            🎉 Game is Now Over! 🎉
          </div>

          <a
            href="/player/winners"
            target="_blank"
            className="inline-block mt-4 text-lg font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 text-black px-6 py-3 rounded-full shadow-lg border-2 border-yellow-500 hover:scale-105 transition transform duration-300 hover:shadow-2xl animate-glow"
          >
            🏆 View Winners 🏆
          </a>
        </div>
      ) : ' '}


      <div className="mb-6 w-full flex flex-col items-center px-4">
        {/* Current number */}
        <div className="text-4xl font-extrabold mb-4 text-center text-black">
          Current Number:
          <span className="ml-3 text-black bg-yellow-300 px-3 py-2 text-2xl rounded shadow">
            {currentNumber !== null ? currentNumber : 'Waiting...'}
          </span>
        </div>

        {/* History numbers */}
        <div className="flex overflow-x-auto whitespace-nowrap gap-2 w-full max-w-4xl bg-opacity-70 rounded p-3 shadow-inner">
          {numberHistory.map((num, idx) => (
            <span
              key={idx}
              className="bg-yellow-400 rounded-md text-red-800 font-bold px-3 py-2 shadow text-lg"
            >
              {num}
            </span>
          ))}
        </div>
      </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tickets.map((ticket, index) => (
          <div key={index} className="animated-ticket p-4 text-white shadow-lg">
            <h3 className=" rounded-lg underline  mb-2 text-center text-black font-bold">Ticket {ticket.ticketNumber}</h3>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse mb-2 text-white">
                <tbody>
                  {ticket.ticket.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((num, colIndex) => {
                        const isMarked = numberHistory.includes(num);
                        return (
                          <td
                            key={colIndex}
                            className={`border w-7 h-7 border-black text-center ${num === 0
                              ? 'bg-gray-200'
                              : isMarked
                                ? 'bg-black text-white font-bold'
                                : 'bg-red-700 text-white'
                              }`}
                          >
                            {num === 0 ? '' : num}
                          </td>
                        );
                      })}

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`w-full py-1 rounded font-bold transition-all duration-300 px-2 border shadow-xl border-red-900 text-black hover:bg-black hover:text-white animate-glow}`}>
              {ticket.name}
            </div>
          </div>

        ))}

      </div>
    </div>

  );
};

export default GameStart;
