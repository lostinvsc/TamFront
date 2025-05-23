import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported
import socket from './socket'; // Adjust path if needed
import useUnsavedChangesWarning from "./Dontleave.jsx";
import NavigationGuard from "./NavigationGuard";
import { backendURL } from './config';
import ContactButtons from "./ContactButtons";
import UnsoldTickets from './UnsoldTickets.jsx';
import melody from "./assets/melody.mp3"

const GameStart = () => {
  const [currentNumber, setCurrentNumber] = useState(null);
  const [numberHistory, setNumberHistory] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [voice, setVoice] = useState("");
  const [check, setCheck] = useState();
  const [showUnsoldPopup, setShowUnsoldPopup] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [audio] = useState(new Audio(melody));

  useEffect(() => {
    audio.loop = true; // Loop the song
    audio.volume = 0.5; // Optional: Set initial volume
    if (isMusicPlaying) {
      audio.play().catch((err) => console.warn("Autoplay error:", err));
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isMusicPlaying, audio]);


  useUnsavedChangesWarning(leaving);

  const speakNumber = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    const setVoiceAndSpeak = () => {
      const voices = speechSynthesis.getVoices();
      if (!voices.length) {
        console.warn("Voices not loaded yet.");
        return;
      }

      const preferredVoice = voices.find((v) => {
        const name = v.name.toLowerCase();
        const isEnglish = v.lang.includes("en");
        if (voice.length != 4) {
          return isEnglish && (
            name.includes("female") ||
            name.includes("woman") ||
            name.includes("samantha") ||
            name.includes("karen") ||
            name.includes("google us english")
          );
        }
      });

      utterance.voice = preferredVoice || voices[0];
      utterance.pitch = voice.length === 4 ? 1 : 1.2;
      utterance.rate = 1;
      utterance.lang = 'en-US';

      speechSynthesis.speak(utterance);
    };

    // Ensure voices are loaded
    if (!speechSynthesis.getVoices().length) {
      // Wait for voiceschanged event
      speechSynthesis.onvoiceschanged = () => {
        setVoiceAndSpeak();
      };
    } else {
      setVoiceAndSpeak();
    }
  };


  useEffect(() => {
    const getvoice = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/getvoice`);


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

      speakNumber("Game is over, check winners")

      setGameOver(true);
    });

    // Call for pattren winners

    socket.on("new-winner", (val) => {
      const names = val.value.join(" and ");
      speakNumber(`${val.type} by ${names}`);

    });


    return () => {
      socket.off("number");
      socket.off("game-over");
      socket.off("new-winner");

    };
  }, [numberHistory]); // Add `numberHistory` to the dependency array

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/getsoldtickets`);
      const allTickets = res.data.tickets;
      setTickets(allTickets);
      // setVoice(res.data.voiceType);

    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };



  return (
    <div className='h-screen w-full overflow-auto flex flex-col text-black mx-auto pb-16  sm:px-6 lg:px-8 animated-gradient'>
      <NavigationGuard when={leaving} message="If you leave, can't see this game later. Leave anyway?" />
      <div className='text-white px-4 py-2 w-full my-8  flex flex-wrap justify-between'>

        <Link
          to="/"
          className="bg-red-700 px-4 py-2 rounded hover:bg-black transition w-fit "
        >
          ← Return
        </Link>
        <button
          onClick={() => setShowUnsoldPopup(!showUnsoldPopup)}
          className=" px-3 bg-green-800 text-white rounded-md items-center"
        >
          Unsold Tickets
        </button>
      </div>

      <div className='text-white px-4 py-2 w-full  flex flex-wrap'>
        <button
          onClick={() => setIsMusicPlaying(!isMusicPlaying)}
          className="px-3 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 transition"
        >
          {isMusicPlaying ? "⏸ Stop Music" : "▶ Play Music"}
        </button>
      </div>

      <div className="w-full max-w-md mx-auto my-4 px-4">
        <input
          type="text"
          placeholder="Search ticket by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

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


      <div className="mb-6 w-full flex flex-col items-center px-2">
        {/* Current number */}
        <div className="text-2xl font-extrabold mb-4 text-center text-black">
          Number:
          <span className="ml-3 text-black bg-yellow-300 px-3 py-2 text-lg rounded shadow">
            {currentNumber !== null ? currentNumber : 'Waiting...'}
          </span>
        </div>

        {/* History numbers */}
        <div className="flex flex-wrap gap-2 w-full max-w-4xl bg-opacity-70 rounded p-3 shadow-inner">
          {numberHistory.map((num, idx) => (
            <span
              key={idx}
              className="bg-yellow-400 rounded-md text-red-800 font-bold px-3 py-2 shadow text-sm"
            >
              {num}
            </span>
          ))}
        </div>

      </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tickets
          .filter(ticket =>
            ticket.name.toLowerCase().includes(searchName.toLowerCase())
          )
          .map((ticket, index) => (

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
      <ContactButtons />

      <div

        className={`fixed top-0 left-0 h-screen bg-green-700  w-[90%] max-w-md bg-gradient-to-r text-white shadow-lg z-40 
    transform transition-transform duration-500 ease-in-out ${showUnsoldPopup ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-end p-4">
            <button
              className="text-white font-bold text-2xl"
              onClick={() => setShowUnsoldPopup(false)}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <UnsoldTickets />
          </div>
        </div>
      </div>





    </div>

  );
};

export default GameStart;
