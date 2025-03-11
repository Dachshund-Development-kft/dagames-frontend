import React, { useEffect } from 'react';
import { MdAlternateEmail } from 'react-icons/md';
import { verify } from '../api/verify';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyPage: React.FC = () => {
    useEffect(() => {
        const fetchData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (code) {
                try {
                    const response = await verify(code);
                    if (response.success) {
                        toast.success("Verification successful! Redirecting to login...");
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 2000);
                    } else {
                        toast.error(response.message || "Verification failed. Please try again.");
                    }
                } catch (error) {
                    console.error('Failed to verify:', error);
                    if (axios.isAxiosError(error)) {
                        if (axios.isAxiosError(error)) {
                            if (error.response) {
                                toast.error(error.response.data.message || 'An error occurred during verification');
                            } else if (error.request) {
                                toast.error('Network error. Please check your connection.');
                            } else {
                                toast.error('An unexpected error occurred');
                            }
                        } else {
                            toast.error('An unexpected error occurred');
                        }
                    } else {
                        toast.error('An unexpected error occurred');
                    }
                }
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const code = (e.currentTarget.elements[0] as HTMLInputElement).value;

        try {
            const response = await verify(code);
            if (response.success) {
                toast.success("Verification successful! Redirecting to login...");
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000); 
            } else {
                toast.error(response.message || "Verification failed. Please try again.");
            }
        } catch (error) {
            console.error('Failed to verify:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    toast.error(error.response.data.message || 'An error occurred during verification');
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
        <div className="flex flex-col min-h-screen text-white bg-cover bg-repeat-y" style={{ backgroundImage: "url(/blobs.svg)" }}>
            <main className="flex flex-grow items-center justify-center py-16">
                <form className="bg-black bg-opacity-50 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-sm text-center" onSubmit={handleSubmit}>
                    <h2 className="text-3xl font-bold bg-white bg-clip-text">
                        Verify
                    </h2>
                    <div className="flex flex-col gap-4 mt-10">
                        <p>Type in the code from the verify email.</p>
                        <div className="flex items-center bg-black bg-opacity-70 text-white rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 transform duration-300">
                            <MdAlternateEmail className="text-gray-500 mr-2" />
                            <input type="text" placeholder="Code" className="bg-transparent flex-1 outline-none focus:ring-0" />
                        </div>
                        <button type="submit" className="bg-[#0F1015] text-white px-5 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 w-full mt-4">
                            Verify
                        </button>
                    </div>
                </form>
            </main>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div>
    );
};

export default VerifyPage;
