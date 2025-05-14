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
        if (localStorage.getItem('adminToken') === 'generateTicketS') {
            fetchTickets();
        } else {
            navigate('/host/login');
        }
    }, [navigate]);

    const groupedTickets = useMemo(() => {
        const groups = {};
        tickets.forEach(ticket => {
            if (!groups[ticket.name]) {
                groups[ticket.name] = [];
            }
            groups[ticket.name].push(ticket.ticketNumber);
        });
        return groups;
    }, [tickets]);

    return (
        <div className="h-screen overflow-auto w-full text-black mx-auto pb-16 px-4 sm:px-6 lg:px-8 animated-gradient">
            <div className="mt-4 mb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-red-700 text-white px-4 py-2 rounded hover:bg-black transition"
                >
                    ← Return
                </button>
            </div>

            <h2 className="text-3xl my-10 font-extrabold text-yellow-400 animate-pulse drop-shadow-lg bg-gradient-to-r from-red-700 to-yellow-600 py-4 px-6 rounded-xl shadow-xl border-4 border-yellow-500 text-center">
                Player List with Ticket Numbers
            </h2>

            <div className="w-full max-w-4xl mx-auto">
                <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
                    <thead>
                        <tr className="bg-yellow-400 text-black text-left">
                            <th className="py-3 px-6 text-lg font-semibold">Name</th>
                            <th className="py-3 px-6 text-lg font-semibold">Ticket Numbers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedTickets).map(([name, ticketNumbers], index) => (
                            <tr key={index} className="border-t border-gray-300">
                                <td className="py-3 px-6 font-medium">{name}</td>
                                <td className="py-3 px-6">{ticketNumbers.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayersList;
