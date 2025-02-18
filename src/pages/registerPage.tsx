import React from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdAlternateEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { register } from '../api/register';

const RegisterPage: React.FC = () => {
    const handleRegister = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        const username = (document.getElementById('username') as HTMLInputElement)?.value || '';
        const password = (document.getElementById('password') as HTMLInputElement)?.value || '';
        const passwordAgain = (document.getElementById('passwordAgain') as HTMLInputElement)?.value || '';
        const email = (document.getElementById('email') as HTMLInputElement)?.value || '';

        if (password !== passwordAgain) {
            alert("Passwords do not match");
            return;
        }

        const success = await register(username, password, email);

        if (success) {
            alert("User registered");
            window.location.href = '/verify';
        }
    }
    return (
        <div className="flex flex-col min-h-screen text-white bg-cover bg-repeat-y" style={{ backgroundImage: "url(/blobs.svg)" }}>
            <main className="flex flex-grow items-center justify-center py-16">
                <form className="bg-black bg-opacity-30 rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
                    <h2 className="text-3xl font-bold bg-white bg-clip-text">
                        Register
                    </h2>
                    <div className="flex flex-col gap-4 mt-10">
                        <div className="flex items-center bg-black text-white rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 transform duration-300">
                            <FaUser className="text-gray-500 mr-2" />
                            <input id='username' type="text" placeholder="Username" className="bg-transparent flex-1 outline-none focus:ring-0" />
                        </div>
                        <div className="flex items-center bg-black text-white rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 transform duration-300">
                            <MdAlternateEmail className="text-gray-500 mr-2" />
                            <input id='email' type="email" placeholder="Email" className="bg-transparent flex-1 outline-none focus:ring-0" />
                        </div>
                        <div className="flex items-center bg-black text-white rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 transform duration-300">
                            <FaLock className="text-gray-500 mr-2" />
                            <input id='password' type="password" placeholder="Password" className="bg-transparent flex-1 outline-none focus:ring-0" />
                        </div>
                        <div className="flex items-center bg-black text-white rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 transform duration-300">
                            <FaLock className="text-gray-500 mr-2" />
                            <input id='passwordAgain' type="password" placeholder="Password again " className="bg-transparent flex-1 outline-none focus:ring-0" />
                        </div>
                        <button onClick={handleRegister} type="submit" className="bg-[#0F1015] text-white px-5 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 w-full mt-4">
                            Register
                        </button>
                        <p>Have an account?
                            <Link to="/login" className="text-blue-400 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default RegisterPage;