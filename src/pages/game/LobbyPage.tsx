import React, { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/navLayoutGame';
import { me } from '../../api/me';
import socket from '../../api/socket';
import LobbyLayout from '../../components/lobbyLayout';
import { FaEye, FaEyeSlash, FaLock, FaTimes } from 'react-icons/fa';

const PlayPage: React.FC = () => {
    const [lobbyPopup, setLobbyPopup] = useState<boolean>(false);
    const [lobbyVisibility, setLobbyVisibility] = useState<boolean>(true);
    const [lobbyName, setLobbyName] = useState<string>('');
    const [lobbyPassword, setLobbyPassword] = useState<string>('');

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
    }, []);

    const createLobby = () => {
        if (!socket) {
            alert('Socket not connected');
            return;
        }

        console.log('Creating lobby...');
        setLobbyPopup(true);
    }

    const handleVisibilityChange = (visibility: boolean) => {
        setLobbyVisibility(visibility);
        if (visibility) {
            setLobbyPassword('');
        }
    }

    return (
        <main className='flex flex-col items-center justify-center min-h-screen bg-[#0F1015]' style={{ backgroundImage: "url(/blobs.svg)" }}>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center gap-4'>
                <LobbyLayout />

                <div className='flex flex-col items-center justify-center gap-4'>
                    <h1 className='text-2xl font-bold text-white'>Create Lobby</h1>
                    <button className='text-white bg-black bg-opacity-50 p-3 m-3 rounded-md text-2xl' onClick={createLobby}>Create</button>
                </div>

                {lobbyPopup && (
                    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
                        <div className='bg-[#1E1F25] p-4 rounded-lg w-96'>
                            <div className='flex justify-between items-center mb-4'>
                                <h1 className='text-2xl font-bold text-white'>Lobby Settings</h1>
                                <button onClick={() => setLobbyPopup(false)} className='text-white'>
                                    <FaTimes />
                                </button>
                            </div>
                            <div className='mb-4'>
                                <label className='text-white'>Lobby Name</label>
                                <input
                                    type='text'
                                    placeholder='Lobby Name'
                                    className='bg-[#1E1F25] text-white p-2 w-full rounded-md border border-gray-600'
                                    value={lobbyName}
                                    onChange={(e) => setLobbyName(e.target.value)}
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='text-white'>Visibility</label>
                                <div className='flex items-center gap-4 mt-2'>
                                    <button
                                        className={`flex items-center gap-2 p-2 rounded-md ${lobbyVisibility ? 'bg-blue-500' : 'bg-gray-700'}`}
                                        onClick={() => handleVisibilityChange(true)}
                                    >
                                        <FaEye />
                                        <span>Public</span>
                                    </button>
                                    <button
                                        className={`flex items-center gap-2 p-2 rounded-md ${!lobbyVisibility ? 'bg-blue-500' : 'bg-gray-700'}`}
                                        onClick={() => handleVisibilityChange(false)}
                                    >
                                        <FaEyeSlash />
                                        <span>Private</span>
                                    </button>
                                </div>
                            </div>
                            {!lobbyVisibility && (
                                <div className='mb-4'>
                                    <label className='text-white'>Lobby Password</label>
                                    <div className='relative'>
                                        <input
                                            type='password'
                                            placeholder='Lobby Password'
                                            className='bg-[#1E1F25] text-white p-2 w-full rounded-md border border-gray-600'
                                            value={lobbyPassword}
                                            onChange={(e) => setLobbyPassword(e.target.value)}
                                        />
                                        <FaLock className='absolute right-3 top-3 text-gray-400' />
                                    </div>
                                </div>
                            )}
                            <button
                                className='text-white bg-blue-500 p-2 w-full rounded-md text-lg mt-4'
                                onClick={() => {
                                    console.log('Lobby Name:', lobbyName);
                                    console.log('Lobby Visibility:', lobbyVisibility ? 'Public' : 'Private');
                                    console.log('Lobby Password:', lobbyPassword);
                                    setLobbyPopup(false);

                                    socket.emit('create_lobby', {
                                        name: lobbyName,
                                        public: lobbyVisibility,
                                        password: lobbyPassword
                                    });

                                    socket.on('create_lobby', (data) => {
                                        console.log('Lobby created:', data);

                                        if (data.id) {
                                            window.location.href = `/play/${data.id}`;
                                            console.log('Redirecting to lobby:', data.id);
                                        }
                                    });
                                }}
                            >
                                Create Lobby
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default PlayPage;