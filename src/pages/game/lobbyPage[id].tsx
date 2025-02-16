import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavLayoutGame from '../../components/navLayoutGame';
import { me } from '../../api/me';
import socket from '../../api/socket';

const PlayPageID: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [lobbyData, setLobbyData] = useState<any>(null);
    const [players, setPlayers] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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

        if (!socket) {
            alert('Socket not connected');
        }

        socket.emit('auth', { token: localStorage.getItem('token') });

        socket.on('lobby_update', (data: any) => {
            if (data.id === id) {
                setPlayers(data.players);
            }
        });

        socket.on('lobby_message', (data: any) => {
            if (data.id === id) {
                alert(data.message);
            }
        });

        const fetchLobbyData = async () => {
            try {
                const response = await fetch(`https://api.dagames.online/v1/lobby/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                setLobbyData(data);
                setPlayers(data.players);
                setLoading(false);

                localStorage.setItem('lobby_id', data.id);
            } catch (err) {
                console.error('Failed to fetch lobby data:', err);
                setLoading(false);
                return window.location.href = '/play';
            }
        };

        fetchLobbyData();
    }, []);

    const leaveLobby = async () => {
        const id = window.location.pathname.split('/')[2];
        socket.emit('leave_lobby', { id: id });

        socket.on('leave_lobby', (data: any) => {
            if (data.success) {
                window.location.href = '/play';
                localStorage.removeItem('lobby_id');
            } else {
                alert('Failed to leave lobby');
            }
        });
    }

    if (loading) {
        return <div className='text-white'>Loading...</div>;
    }

    if (!lobbyData) {
        return <div className='text-white'>Lobby not found</div>;
    }

    return (
        <>
            <main className='flex flex-col items-center justify-center min-h-screen bg-[#0F1015]' style={{ backgroundImage: "url(/blobs.svg)" }}>
                <NavLayoutGame />
                <div className='flex flex-grow items-center justify-center gap-4'>
                    <h1 className='text-2xl font-bold text-white'>Lobby: {lobbyData.name}</h1>
                    <div className='bg-[#1E1F25] p-4 rounded-lg w-96'>
                        <h2 className='text-xl font-bold text-white mb-4'>Players in Lobby</h2>
                        <ul className='text-white'>
                            {players.map((player, index) => (
                                <li key={index} className='flex items-center gap-2 mb-2'>
                                    <span>{player}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={leaveLobby} className='bg-[#FF4D4F] text-white px-4 py-2 rounded-lg mt-4'>Leave Lobby</button>
                    </div>
                </div>
            </main>
        </>
    );
};

export default PlayPageID;