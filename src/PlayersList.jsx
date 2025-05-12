import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backendURL } from './config';

const PlayersList = () => {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axios.get(`${backendURL}/api/getsoldtickets`);
                setTickets(res.data.tickets || []);
            } catch (err) {
                console.error('Error fetching tickets:', err);
            }
        };
        if(localStorage.getItem('adminToken')=="generateTicketS"){
             fetchTickets();
        }else{
navigate('/host/login');


        }

 
    }, []);

    // Group tickets by name
    const groupedTickets = useMemo(() => {
        const groups = {};
        tickets.forEach(ticket => {
            if (!groups[ticket.name]) {
                groups[ticket.name] = [];
            }
            groups[ticket.name].push(ticket);
        });
        return groups;
    }, [tickets]);

    return (
        <div className='h-screen overflow-auto w-full flex flex-col  text-black mx-auto pb-16 px-4 sm:px-6 lg:px-8 animated-gradient'>

            <div className="mt-4 mb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-red-700 text-white px-4 py-2 rounded hover:bg-black transition"
                >
                    ← Return
                </button>
            </div>
            <h2 className="text-3xl my-10 font-extrabold text-yellow-400 animate-pulse drop-shadow-lg bg-gradient-to-r from-red-700 to-yellow-600 py-4 px-6 rounded-xl shadow-xl border-4 border-yellow-500 text-center">
                See the ticket list name wise
            </h2>

            <div className="flex flex-col gap-8 items-center w-full ">
                {Object.entries(groupedTickets).map(([name, userTickets]) => (
                    <div key={name}>
                        <h3 className="text-xl font-bold text-center mb-4 underline text-white bg-yellow-500 w-full hover:bg-orange-400 animate-glow  p-2 rounded">
                            {name}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                            {userTickets.map((ticket, index) => (
                                <div key={index} className="animated-ticket p-4 text-white shadow-lg">
                                    <h4 className="rounded-lg underline mb-2 text-center text-black font-bold">
                                        Ticket {ticket.ticketNumber}
                                    </h4>

                                    <div className="overflow-x-auto">
                                        <table className="table-auto w-full border-collapse mb-2 text-white">
                                            <tbody>
                                                {ticket.ticket.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        {row.map((num, colIndex) => (
                                                            <td
                                                                key={colIndex}
                                                                className={`border w-7 h-7 border-black text-center ${num === 0
                                                                    ? 'bg-gray-200'
                                                                    : 'bg-red-700 text-white'
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
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayersList;
