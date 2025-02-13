import React, { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/navLayoutGame';
import { me } from '../../api/me';
import socket from '../../api/socket';
import LobbyLayout from '../../components/lobbyLayout';

const PlayPage: React.FC = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await me();
                console.log(response.username);
            } catch (err) {
                localStorage.removeItem('token');
                console.error(err);
                window.location.href = '/login';
            }
        };

        fetchData();

        socket.emit('auth', { token: localStorage.getItem('token') });
    }, []);

    return (
        <main className='flex flex-col items-center justify-center min-h-screen bg-[#0F1015]' style={{ backgroundImage: "url(/blobs.svg)" }}>
            <NavLayoutGame />
            <LobbyLayout />
            <div className='flex flex-grow items-center justify-center gap-4'>
                <h1 className='text-3xl font-bold text-white bg-clip-text'>
                    Lobby
                </h1>
                <div className='flex flex-col items-center justify-center gap-4'>

                </div>
            </div>
        </main>
    );
};

export default PlayPage;