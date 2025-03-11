import React, { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/nav';
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
    rank: string;
}

const PlayPage: React.FC = () => {
    const [lobbyPopup, setLobbyPopup] = useState<boolean>(false);
    const [lobbyVisibility, setLobbyVisibility] = useState<boolean>(true);
    const [lobbyName, setLobbyName] = useState<string>('');
    const [lobbyPassword, setLobbyPassword] = useState<string>('');
    const [lobbies, setLobbies] = useState<Lobby[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLobbies = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No token found in localStorage');
                setLoading(false);
                return;
            }

            try {
                const response = await lobby();
                setLobbies(response.data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setLoading(false);
            }
        };

        fetchLobbies();

        if (!socket) {
            setError('Socket not connected');
        }

        setTimeout(() => {
            if (localStorage.getItem('lobby_id')) {
                console.log('Leaving lobby:', localStorage.getItem('lobby_id'));
                socket.emit('leave_lobby', { id: localStorage.getItem('lobby_id') });

                socket.on('leave_lobby', (data: any) => {
                    if (data.success) {
                        localStorage.removeItem('lobby_id')
                        return window.location.href = '/play';
                    } else {
                        console.log('Data deleted...')
                        localStorage.removeItem('lobby_id')
                    }
                });
            }
        }, 1000);
    }, []);
    
    const createLobby = () => {
        if (!socket) {
            setError('Socket not connected');
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
                    setError('Failed to join lobby: ' + data.message);
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
                    setError('Failed to join lobby: ' + data.message);
                }
            });
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <main className='flex flex-col items-center justify-center min-h-screen text-black'>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center gap-4 p-4'>
                <div className='w-full max-w-4xl'>
                <div className="bg-black bg-opacity-50 rounded-lg shadow-md backdrop-blur-md p-6 text-center">
                        <h1 className='text-2xl font-bold text-white'>Create Lobby</h1>
                        <button
                            className='mt-4 bg-blue-600 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-700 transition-colors'
                            onClick={createLobby}
                        >
                            Create
                        </button>
                    </div>
                    <div className="bg-black bg-opacity-50 rounded-lg shadow-md backdrop-blur-md p-6 mt-8">
                        <h2 className="text-2xl font-bold mb-6 text-center text-white">Active Lobbies</h2>
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                        <div className="overflow-y-auto max-h-[60vh] scrollbar-hide grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
                                {lobbies.map((lobby) => (
                                    <div key={lobby.id} className="p-4 bg-black bg-opacity-70 rounded-lg shadow-md">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-lg text-white">{lobby.name}</span>
                                            <span className={`text-sm ${lobby.public ? 'text-green-400' : 'text-red-400'}`}>
                                                {lobby.public ? 'Public' : 'Private'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-300 mb-2">
                                            Lobby rank: {lobby.rank}
                                        </div>
                                        <div className="text-sm text-gray-300 mb-2">
                                            Owner: {lobby.owner}
                                        </div>
                                        <div className="text-sm text-gray-300 mb-2">
                                            Players: {lobby.players}/2
                                        </div>
                                        {!lobby.public && (
                                            <div className="mb-2">
                                                <input
                                                    type="password"
                                                    placeholder='Password'
                                                    id='pass'
                                                    className="w-full p-2 bg-black bg-opacity-80 text-white rounded-md border border-gray-600"
                                                />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleJoinLobby(lobby.id)}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Join Lobby
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {lobbyPopup && (
                    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
                        <div className='bg-black bg-opacity-50 backdrop-blur-md p-4 rounded-lg w-96'>
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
                                    className='bg-black bg-opacity-70 text-white p-2 w-full rounded-md border border-gray-600'
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
                                            className='bg-black bg-opacity-70 text-white p-2 w-full rounded-md border border-gray-600'
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