import React, { useEffect, useState } from 'react';
import NavLayoutGame from './nav';

const Loading: React.FC = () => {
    const [showRefreshMessage, setShowRefreshMessage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowRefreshMessage(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <main className='flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black bg-opacity-50'>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center w-full'>
                <div className='flex flex-col items-center'>
                    <div className='w-16 h-16 border-4 border-t-4 border-white border-t-gray-700 rounded-full animate-spin'></div>
                    <h1 className='text-white text-6xl font-bold mt-4'>Loading...</h1>
                    {showRefreshMessage && (
                        <p className='text-white mt-2'>
                            This is taking longer than expected. Please refresh the page or check your connection.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Loading;