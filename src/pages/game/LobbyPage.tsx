import React, { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/nav';
import { me } from '../../api/me';
import socket from '../../api/socket';
import { FaEye, FaEyeSlash, FaLock, FaTimes } from 'react-icons/fa';
import { lobby } from '../../api/lobby';
import Loading from '../../components/loading';

interface Lobby {
    id: string;
    name: string;
    public: boolean;
    owner: string;
    players: number;
}

const PlayPage: React.FC = () => {
    const [lobbyPopup, setLobbyPopup] = useState<boolean>(false);
    const [lobbyVisibility, setLobbyVisibility] = useState<boolean>(true);
    const [lobbyName, setLobbyName] = useState<string>('');
    const [lobbyPassword, setLobbyPassword] = useState<string>('');
    const [lobbies, setLobbies] = useState<Lobby[]>([]);
    const [loading, setLoading] = useState(true);

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

        const fetchLobbies = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.log('No token found in localStorage');
                setLoading(false);
                return;
            }

            try {
                const response = await lobby();
                setLobbies(response.data);
                setLoading(false);
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err.message);
                } else {
                    console.log('An unknown error occurred');
                }
                setLoading(false);
            }
        };

        fetchLobbies();

        if (!socket) {
            alert('Socket not connected');
        }

        socket.emit('auth', { token: localStorage.getItem('token') });

        setTimeout(() => {
            if (localStorage.getItem('lobby_id')) {
                console.log('Leaving lobby:', localStorage.getItem('lobby_id'));
                socket.emit('leave_lobby', { id: localStorage.getItem('lobby_id') });

                socket.on('leave_lobby', (data: any) => {
                    if (data.success) {
                        localStorage.removeItem('lobby_id')
                        return window.location.href = '/play';
                    } else {
                        console.log('Data niggered...')
                        localStorage.removeItem('lobby_id')
                    }
                });
            }
        }, 1000);
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

    const handleJoinLobby = (lobbyId: string) => {
        const password = (document.getElementById('pass') as HTMLInputElement)?.value;
        if (password) {
            socket.emit('join_lobby', { id: lobbyId, password: password });

            socket.on('join_lobby', (data: any) => {
                if (data.success) {
                    console.log('Joined lobby:', data.id);
                    localStorage.setItem('lobby_id', data.id);
                    return window.location.href = `/play/${data.id}`;
                } else {
                    console.log('Failed to join lobby:', data.message);
                }
            });
        } else {
            socket.emit('join_lobby', { id: lobbyId });

            socket.on('join_lobby', (data: any) => {
                if (data.success) {
                    console.log('Joined lobby:', data.id);
                    localStorage.setItem('lobby_id', data.id);
                    return window.location.href = `/play/${data.id}`;
                } else {
                    console.log('Failed to join lobby:', data.message);
                }
            });
        }
    };

    if (loading) {
        return <Loading />; // Itt használjuk a Loading komponenst
    }

    return (
        <main className='flex flex-col items-center justify-center min-h-screen'>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center gap-4'>
                <h2 className="text-xl font-bold mb-4">Active Lobbies</h2>
                <ul>
                    {lobbies.map((lobby) => (
                        <li key={lobby.id} className="mb-3 p-3 bg-white bg-opacity-10 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{lobby.name}</span>
                                <span className={`text-sm ${lobby.public ? 'text-green-500' : 'text-red-500'}`}>
                                    {lobby.public ? 'Public' : 'Private'}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                Owner: {lobby.owner}
                            </div>
                            <div className="text-sm text-gray-600">
                                Players: {lobby.players}/2
                            </div>
                            {!lobby.public && (
                                <div className="text-sm text-gray-600">
                                    <input type="password" placeholder='password' id='pass' />
                                </div>
                            )}
                            <button
                                onClick={() => handleJoinLobby(lobby.id)}
                                className="mt-2 w-full bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition-colors"
                            >
                                Join Lobby
                            </button>
                        </li>
                    ))}
                </ul>

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