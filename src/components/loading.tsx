import React from 'react';
import NavLayoutGame from './nav';
const Loading: React.FC = () => {
    return (
        <main className='flex flex-col items-center justify-center min-h-screen overflow-hidden'>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center w-full'>
                <h1 className='text-black text-6xl font-bold'>Loading...</h1>
            </div>
        </main>
    );
};

export default Loading;