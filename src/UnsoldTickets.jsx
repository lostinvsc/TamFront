import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendURL } from './config.js' ;

const UnsoldTickets = () => {
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/getunsoldtickets`);
        setTicketNumbers(res.data.ticketNumbers);
      } catch (err) {
        setError('Failed to fetch unsold tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p className="text-yellow-400 text-center">Loading tickets...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen px-6 text-white mb-14">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400 border py-2 rounded-xl text-center">Unsold Tickets</h2>
      {ticketNumbers.length === 0 ? (
        <p className="text-center">No unsold tickets</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ticketNumbers.map((number, index) => (
            <div
              key={index}
              className="bg-yellow-500 text-black p-4 rounded-lg shadow-lg text-center text-sm font-semibold"
            >
              Ticket- {number}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnsoldTickets;
