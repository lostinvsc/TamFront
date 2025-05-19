import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { backendURL } from './config';
const BuyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [names, setNames] = useState({}); // To track entered names
    const [up, setUp] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [sheetNames, setSheetNames] = useState({}); //changes
    const [loading, setLoading] = useState(true); //changes

    useEffect(() => {

        const fetchTickets = async () => {
            try {
                const res = await axios.get(`${backendURL}/api/gettickets`);

                const allTickets = res.data.tickets
                //   console.log(allTickets)
                setTickets(allTickets);
                setLoading(false)

            } catch (err) {
                console.error('Error fetching tickets:', err);
            }
        };

        fetchTickets();

    }, [up]);
    const handleAssign = async (index) => {
        const name = names[index];
    // console.log(names)
    // console.log(index)
        if (!name || name.trim() === "") return alert("Please enter a name");

        try {
            const data = {
                ticketNumber: index + 1,
                name: name
            };

            const isConfirmed = window.confirm(`Confirm to buy ticket:${index + 1}`);
            if (isConfirmed) {
                await axios.post(`${backendURL}/api/assign-ticket`, data);
                setUp(!up)
            }
        } catch (err) {
            console.error('Error assigning ticket:', err);

            const errorMsg = err.response?.data?.error || "Failed to assign ticket.";

            alert(errorMsg);
        }
    };
    const handleNameChange = (index, value) => {
        setNames(prev => ({ ...prev, [index]: value }));
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
            const isConfirmed = window.confirm(`Confirm to buy sheet:${sheetIndex + 1}`);
            if (isConfirmed) {

                const response = await axios.post(`${backendURL}/api/sellsheet`, data)

                if (response.status == 200) {
                    setUp(!up)
                }
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
            <div className="mt-8 mb-2">
                <Link
                    to="/"
                    className="bg-red-700 text-white px-4 py-2 rounded hover:bg-black transition"
                >
                    ← Return
                </Link>
            </div>

            {loading && 
            <div className='w-full flex justify-center'>
                <div className=" text-yellow-400 w-full px-2 sm:w-fit sm:px-4  p-2 rounded mt-4 text-center">
                    !! Loading Tickets, wait !!
                </div>
            </div>

             }

            <div className="w-full max-w-md mx-auto my-4 px-4">
                <input
                    type="text"
                    placeholder="Search ticket by name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
            </div>

            <div className="">
                <h2 className="text-2xl font-bold w-fit mb-4 mx-auto mt-10 text-center">

                    <br />
                    Tambola Tickets ({tickets.length})

                </h2>
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
                    
                    { !searchName &&  chunkTickets(tickets, 6).map((ticketGroup, groupIndex) => {
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
                                                                        className={`border w-7 h-7 border-black text-center ${num !== 0 ? 'bg-red-700 text-white' : 'bg-gray-200'}`}
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
                                ${ticket.name ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-black'}`}
                                                disabled={!!ticket.name}
                                            >
                                                {ticket.name ? 'Sold ' : 'Buy '}
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
                        ${isAnyTicketSold ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-black'}`}
                                    >
                                        {isAnyTicketSold ? `Can't Buy Sheet ${groupIndex + 1}` : `Buy Sheet ${groupIndex + 1}`}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    { searchName && tickets
                        .filter(ticket =>
                            ticket.name.toLowerCase().includes(searchName.toLowerCase())
                        )
                        .map((ticket, index) => (

                            <div key={index} className="animated-ticket p-4 text-white shadow-lg">
                                <h3 className="font-semibold mb-2 text-center text-black">Ticket {ticket.ticketNumber}</h3>
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
                                    value={names[index] || ""}
                                    onChange={(e) => handleNameChange(index, e.target.value)}
                                    className="w-full border px-2 py-1 rounded mb-2 text-black"
                                />
                                <button
                                    onClick={() => handleAssign(ticket.ticketNumber - 1)}
                                    className={`w-full py-1 rounded text-white transition-all duration-300 
                                ${ticket.name
                                            ? 'bg-gray-300 cursor-not-allowed animate-pulse'
                                            : 'bg-yellow-500 hover:bg-orange-400 animate-glow'
                                        }`}
                                    disabled={!!ticket.name}
                                >
                                    {ticket.name ? 'Sold' : 'Buy'}
                                </button>
                            </div>

                        ))}


                </div>
            </div>
        </div>
    );
};

export default BuyTickets;
