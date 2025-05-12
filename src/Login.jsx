import React, { useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { backendURL } from './config';
const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {

        if(localStorage.getItem('adminToken')=="generateTicketS"){
        navigate('/host/generatetickets');
        }

        
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = {
                password: password
            }
            const response = await axios.post(`${backendURL}/api/login`, data);

            if (response.status == 200) {
                localStorage.setItem('adminToken', response.data.adminToken);

                navigate('/host/generatetickets');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid password. Try again!');
        } finally {
            setLoading(false);
        }
    };

    return (
        
        <div className="min-h-screen w-full bg-gradient-to-br from-black to-gray-900 flex flex-col items-center justify-center px-4">
          <div className="mt-8 mb-2">
                         <Link
                             to="/"
                             className="bg-red-700 text-white px-4 py-2 rounded hover:bg-black transition"
                         >
                             ← Return
                         </Link>
                     </div>
            <form
                onSubmit={handleLogin}
                className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-xl shadow-2xl w-full max-w-sm border border-yellow-400"
            >
                <h2 className="text-3xl font-extrabold text-yellow-400 text-center mb-6 drop-shadow-md tracking-wide">
                    🎲 Host Login
                </h2>

                <input
                    type="password"
                    placeholder="🔐 Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg mb-4 text-white bg-gray-900 border border-yellow-500 placeholder-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                />

                {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition duration-300 glow-button"
                >
                    {loading ? 'Rolling Dice...' : 'Enter the Arena'}
                </button>
            </form>
        </div>
    );
};

export default Login;
