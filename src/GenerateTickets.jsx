import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { backendURL } from './config';
const winOptions = [
    { label: "Full House", code: 1 },
    { label: "Top Line", code: 2 },
    { label: "Mid Line", code: 3 },
    { label: "Bottom Line", code: 4 },
    { label: "4 Corners", code: 5 },
    { label: "Early 5", code: 6 },
    { label: "Early 7", code: 7 },
];

const GenerateTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [names, setNames] = useState({}); // To track entered names
    const [up, setUp] = useState(false);
    // const [count,setCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false); // sidebar toggle
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [seconds, setSeconds] = useState([]);
    const [voice, setVoice] = useState("");
    const [copied, setCopied] = useState(false);
    const [sheetNames, setSheetNames] = useState({}); //changes
    const [loading, setLoading] = useState(false); //changes

    const textToCopy = "https://tam-front.vercel.app/player/buytickets";
    const textToCopy2 = "https://tam-front.vercel.app/player/gamestart";

    const navigate = useNavigate();

    const generatetickets = async () => {
        try {
            let userInput = prompt("Enter Sheet quantity:");
            if (userInput) {
                const data = {
                    n: userInput
                }
                setLoading(true);
                const res = await axios.post(`${backendURL}/api/generate-tickets`, data);
                setNames({})

                setUp(!up)
            }
        } catch (err) {
            console.error('Error fetching tickets:', err);
        }
    };

    const startgame = async () => {
        if (selectedOptions.length === 0) {
            return alert("Please select at least one winning pattern before starting the game.");
        }

        if (voice.length == 0) {
            return alert("Please select voice type.");
        }

        try {
            const isConfirmed = window.confirm("Are you sure you want to start the game?");
            if (isConfirmed) {
                const data = {
                    seconds: seconds || 5,
                    winConditions: selectedOptions,
                };
                const res = await axios.post(`${backendURL}/api/start-game`, data);
                const data2 = {
                    voice: voice
                };
                const res2 = await axios.post(`${backendURL}/api/setvoice`, data2);
            }

        } catch (err) {
            console.error('Error starting game: ', err);
        }
    };




    useEffect(() => {

        const fetchTickets = async () => {
            try {
                const res = await axios.get(`${backendURL}/api/gettickets`);

                const allTickets = res.data.tickets
                //   console.log(allTickets)
                setTickets(allTickets);
                setLoading(false);

            } catch (err) {
                console.error('Error fetching tickets:', err);
            }
        };

        if (localStorage.getItem('adminToken') == "generateTicketS") {
            fetchTickets();
        } else {
            navigate('/host/login');
        }
    }, [up]);


    const handleAssign = async (index) => {
        const name = names[index];
        if (!name || name.trim() === "") return alert("Please enter a name");

        try {
            const data = {
                ticketNumber: index + 1,
                name: name
            };

            const res = await axios.post(`${backendURL}/api/assign-ticket`, data);
            // alert(`Ticket ${index + 1} Assigned to ${name}`);
            setUp(!up)
        } catch (err) {
            console.error('Error assigning ticket:', err);

            const errorMsg =
                err.response?.data?.error || "Failed to assign ticket.";

            alert(errorMsg);
        }
    };



    const handleNameChange = (index, value) => {
        setNames(prev => ({ ...prev, [index]: value }));
    };

    const handleOptionChange = (code) => {
        setSelectedOptions((prev) =>
            prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
        );
    };

    const handleCopy = (textt) => {
        navigator.clipboard.writeText(textt)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    // changes
    const chunkTickets = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };


    const handleSheetNameChange = (sheetIndex, value) => {
        setSheetNames(prev => ({ ...prev, [sheetIndex]: value }));
    };

    const handleSellSheet = async (sheetIndex) => {
        try {

            const data = {
                sheetNumber: sheetIndex + 1,
                name: sheetNames[sheetIndex]
            }

            const response = await axios.post(`${backendURL}/api/sellsheet`, data)

            if (response.status == 200) {
                setUp(!up)
            }

        } catch (error) {

            if (error.response && error.response.status === 400) {
                alert(error.response.data.error); // e.g., "Sheet already sold"
            } else {
                console.error('Error selling sheet:', error);
                alert("Something went wrong while selling the sheet.");
            }
        }
    };



    return (

        <div className='h-screen overflow-auto flex flex-col text-black mx-auto pb-16 px-4 sm:px-6 lg:px-8 animated-gradient'>

                {loading && 
            <div className='w-full flex justify-center'>
                <div className="bg-yellow-400 w-full px-2 sm:w-fit sm:px-4  p-2 rounded mt-4 text-center">
                    !! Generating Sheets, wait !!
                </div>
            </div>

             }

            <div className="mt-8 mb-2">
                <Link
                    to="/"
                    className="bg-red-700 text-white px-4 py-2 rounded hover:bg-black transition"
                >
                    ← Return
                </Link>
            </div>




            <div className="mt-8 mb-2">

                <button onClick={() => handleCopy(textToCopy)} style={{ background: 'linear-gradient(to right, purple 0%, red 100%' }} className='px-4 sm:w-[250px] sm:px-4 w-full text-center py-2  text-white hover:bg-black transition rounded'>Copy Link to Buy Tickets</button>
                {copied && <span className='fixed top-3 left-1/2 mr-3 text-white'>Copied</span>}

            </div>
            <div className="mt-8 mb-2">

                <button onClick={() => handleCopy(textToCopy2)} style={{ background: 'linear-gradient(to right, red 0%, purple 100%)' }} className='px-4 sm:w-[250px] sm:px-4 w-full text-center py-2  bg-orange-600 text-white hover:bg-black transition rounded'>Copy Link to Join Game</button>


            </div>

            <div className="">
                <h2 className="text-2xl font-bold w-fit mb-4 mx-auto mt-10 text-center">
                    <span className="block animated-gradient border text-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base md:text-lg text-center w-full max-w-md mx-auto">
                        Start the game when all players have joined the room.
                    </span>

                    <br />
                    Generated Tambola Tickets ({tickets.length})

                </h2>

                {/* Menu button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="fixed right-4 bottom-4 z-10 h-10 w-10 bg-gray-800 text-white rounded-md items-center"
                >
                    ☰
                </button>

                {/* Sidebar */}
                <div className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-r from-pink-400 via-teal-500 to-orange-300 text-white shadow-lg z-40 
    transform transition-transform duration-500 ease-in-out
    ${sidebarOpen ? 'animate-slideColorful animate-glowing-sidebar' : 'translate-x-full'}`}>

                    <div className="p-4 text-lg font-semibold">
                        <button className="float-right text-black font-bold" onClick={() => setSidebarOpen(false)}>✕</button>
                    </div>

                    <div className="p-4 ">
                        <button
                            onClick={generatetickets}
                            className="w-full bg-gray-600 hover:bg-black text-white py-2 rounded mb-5"
                        >
                            Generate New Tickets
                        </button>

                        <button
                            onClick={startgame}
                            className="w-full bg-gray-600 hover:bg-black text-white py-2 rounded mb-5"
                        >
                            Start Game
                        </button>

                        <Link to="/host/list" className="block">
                            <button className="w-full  bg-gray-600 hover:bg-black text-white py-2 mb-5 rounded">
                                List
                            </button>
                        </Link>
                        {winOptions.map(option => (
                            <div key={option.code} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`option-${option.code}`}
                                    checked={selectedOptions.includes(option.code)}
                                    onChange={() => handleOptionChange(option.code)}
                                    className="mr-2"
                                />
                                <label htmlFor={`option-${option.code}`}>{option.label}</label>
                            </div>
                        ))}
                    </div>

                    <div className="m-5">
                        <label htmlFor="secondsRange" className="block font-semibold mb-1">
                            Seconds: {seconds}
                        </label>
                        <input
                            type="range"
                            id="secondsRange"
                            min="3"
                            max="10"
                            step="1"
                            value={seconds}
                            onChange={(e) => setSeconds(Number(e.target.value))}
                            className="w-full accent-white"
                        />
                    </div>

                    <div className="m-5">
                        <label className="block font-semibold mb-2 text-white">Voice Type</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="voice"
                                    value="male"
                                    checked={voice === "male"}
                                    onChange={() => setVoice("male")}
                                    className="mr-2"
                                />
                                Male
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="voice"
                                    value="female"
                                    checked={voice === "female"}
                                    onChange={() => setVoice("female")}
                                    className="mr-2"
                                />
                                Female
                            </label>
                        </div>
                    </div>


                </div>




                <div className="flex flex-wrap gap-2 justify-center mb-20">
                    {tickets.map((ticket, i) => (
                        <div
                            key={i}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${ticket.name ? 'bg-red-500' : 'bg-gray-400'}`}
                            title={ticket.name || `Ticket ${ticket.ticketNumber}`}
                        >
                            {ticket.ticketNumber}
                        </div>
                    ))}
                </div>





                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {chunkTickets(tickets, 6).map((ticketGroup, groupIndex) => {
                        const isAnyTicketSold = ticketGroup.some((ticket) => !!ticket.name);

                        return (
                            <div key={groupIndex} className="flex flex-col gap-1 mb-16 winners-container rounded-lg border">
                                <h3 className="font-semibold text-center text-white underline mt-2 text-xl">
                                    Sheet {groupIndex + 1}
                                </h3>

                                {ticketGroup.map((ticket, index) => {
                                    const actualIndex = groupIndex * 6 + index;
                                    return (
                                        <div key={ticket.ticketNumber} className="py-3 px-2 text-white">
                                            <div className="overflow-x-auto">
                                                <table className="table-auto w-full border-collapse mb-2 text-white">
                                                    <tbody>
                                                        {ticket.ticket.map((row, rowIndex) => (
                                                            <tr key={rowIndex}>
                                                                {row.map((num, colIndex) => (
                                                                    <td
                                                                        key={colIndex}
                                                                        className={`border w-7 h-7 border-black text-center ${num !== 0 ? 'bg-red-700 text-white' : 'bg-gray-200'
                                                                            }`}
                                                                    >
                                                                        {num === 0 ? '' : num}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <input
                                                type="text"
                                                placeholder={ticket.name ? `Sold to: ${ticket.name}` : "Enter Name"}
                                                value={names[actualIndex] || ""}
                                                onChange={(e) => handleNameChange(actualIndex, e.target.value)}
                                                className="w-full border px-2 py-1 rounded mb-2 text-black"
                                            />

                                            <button
                                                onClick={() => handleAssign(ticket.ticketNumber - 1)}
                                                className={`w-full py-1 rounded text-white transition-all duration-300 
                                                 ${ticket.name
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-yellow-500 hover:bg-black'
                                                    }`}
                                                disabled={!!ticket.name}
                                            >
                                                {ticket.name ? 'Sold ' : 'Sell '}
                                                <span>Ticket-{ticket.ticketNumber}</span>
                                            </button>
                                        </div>
                                    );
                                })}

                                {/* 🔽 Sheet-level input and button */}
                                <div className="mt-6 px-2">
                                    <input
                                        type="text"
                                        placeholder={sheetNames[groupIndex] ? `Sold to: ${sheetNames[groupIndex]}` : "Enter Name"}
                                        value={sheetNames[groupIndex] || ""}
                                        onChange={(e) => handleSheetNameChange(groupIndex, e.target.value)}
                                        className="w-full border px-2 py-3 rounded mb-2 text-black"
                                    />

                                    <button
                                        onClick={() => handleSellSheet(groupIndex)}
                                        disabled={isAnyTicketSold}
                                        className={`w-full py-2 mb-3 rounded text-white transition-all duration-300 font-semibold
                                               ${isAnyTicketSold
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-red-500 hover:bg-black'
                                            }`}
                                    >
                                        {isAnyTicketSold ? `Can't Sell Sheet ${groupIndex + 1}` : `Sell Sheet ${groupIndex + 1}`}
                                    </button>
                                </div>
                            </div>
                        );
                    })}



                </div>
            </div>
        </div>
    );
};

export default GenerateTickets;
