import React, { useEffect, useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AlertLayout from '../components/alert';
import { login } from '../api/login';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token')) {
            window.location.href = '/';
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await login(username, password);

            if (response.token) {
                localStorage.setItem('token', response.token);
                window.location.href = '/';
            } else {
                toast.error('Invalid username or password');
            }
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    toast.error(error.response.data.message || 'An error occurred during login');
                } else if (error.request) {
                    toast.error('Network error. Please check your connection.');
                } else {
                    toast.error('An unexpected error occurred');
                }
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen text-white bg-cover bg-repeat-y bg-[url('/blobs.svg')]">
            <AlertLayout />
            <main className="flex flex-grow items-center justify-center py-16">
                <form onSubmit={handleLogin} className="bg-black bg-opacity-50 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
                    <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent">
                        Login
                    </h2>
                    <div className="flex flex-col gap-4 mt-10">
                        <div className="flex items-center bg-black bg-opacity-70 text-white rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 transition duration-300">
                            <FaUser className="text-gray-500 mr-2" />
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-transparent flex-1 outline-none focus:ring-0 placeholder-gray-400" />
                        </div>
                        <div className="flex items-center bg-black bg-opacity-70 text-white rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 transition duration-300">
                            <FaLock className="text-gray-500 mr-2" />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent flex-1 outline-none focus:ring-0 placeholder-gray-400" />
                        </div>
                        <button type="submit" className="bg-[#0F1015] text-white px-5 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all duration-300 w-full mt-4">
                            Login
                        </button>
                        <p>Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link></p>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default LoginPage;