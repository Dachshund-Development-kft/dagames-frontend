import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NavLayoutGame from '../../components/nav';
import socket, { ensureSocketConnectedAndAuthenticated } from '../../api/socket';
import { FaEye, FaEyeSlash, FaLock, FaTimes } from 'react-icons/fa';
import Loading from '../../components/loading';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';

interface Lobby {
    id: string;
    name: string;
    public: boolean;
    owner: string;
    players: number;
    rank: string;
}

interface LobbySocketResponse {
    success: boolean;
    message?: string;
    data?: Lobby[];
    id?: string;
}

const PlayPage: React.FC = () => {
    const [lobbyPopup, setLobbyPopup] = useState<boolean>(false);
    const [lobbyVisibility, setLobbyVisibility] = useState<boolean>(true);
    const [lobbyName, setLobbyName] = useState<string>('');
    const [lobbyPassword, setLobbyPassword] = useState<string>('');
    const [lobbies, setLobbies] = useState<Lobby[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [passwordByLobby, setPasswordByLobby] = useState<Record<string, string>>({});

    const hasToken = useMemo(() => Boolean(localStorage.getItem('token')), []);

    const fetchLobbies = useCallback(() => {
        if (!hasToken) {
            toast.error('No token found in localStorage');
            setLoading(false);
            return;
        }

        ensureSocketConnectedAndAuthenticated();

        const onLobbies = (data: LobbySocketResponse): void => {
            if (data.success && data.data) {
                setLobbies(data.data);
            } else if (data.message) {
                toast.error(data.message);
            }

            setLoading(false);
        };

        socket.once('get_lobbies', onLobbies);
        socket.emit('get_lobbies');
    }, [hasToken]);

    useEffect(() => {
        fetchLobbies();
        const intervalId = window.setInterval(fetchLobbies, 2500);

        return () => {
            window.clearInterval(intervalId);
            socket.off('get_lobbies');
        };
    }, [fetchLobbies]);

    useEffect(() => {
        ensureSocketConnectedAndAuthenticated();

        const existingLobbyId = localStorage.getItem('lobby_id');
        if (!existingLobbyId) {
            return;
        }

        const onLeaveLobby = (data: LobbySocketResponse): void => {
            localStorage.removeItem('lobby_id');

            if (data.success) {
                window.location.href = '/play';
            }
        };

        socket.once('leave_lobby', onLeaveLobby);
        socket.emit('leave_lobby', { id: existingLobbyId });
    }, []);

    useEffect(() => {
        if (isMobile) {
            alert('You cant open this on mobile');
            window.location.href = '/';
        }
    }, []);

    const handleVisibilityChange = (visibility: boolean): void => {
        setLobbyVisibility(visibility);
        if (visibility) {
            setLobbyPassword('');
        }
    };

    const handleJoinLobby = (lobbyId: string): void => {
        ensureSocketConnectedAndAuthenticated();

        const password = passwordByLobby[lobbyId] || '';
        const onJoinLobby = (data: LobbySocketResponse): void => {
            if (data.success && data.id) {
                localStorage.setItem('lobby_id', data.id);
                window.location.href = `/play/${data.id}`;
                return;
            }

            toast.error(`Failed to join lobby: ${data.message || 'Unknown error'}`);
        };

        socket.once('join_lobby', onJoinLobby);
        socket.emit('join_lobby', password ? { id: lobbyId, password } : { id: lobbyId });
    };

    const submitCreateLobby = (): void => {
        if (!lobbyName.trim()) {
            toast.error('Lobby name is required');
            return;
        }

        ensureSocketConnectedAndAuthenticated();
        setLobbyPopup(false);

        const onCreateLobby = (data: LobbySocketResponse): void => {
            if (data.success && data.id) {
                window.location.href = `/play/${data.id}`;
                return;
            }

            toast.error(data.message || 'Failed to create lobby');
        };

        socket.once('create_lobby', onCreateLobby);
        socket.emit('create_lobby', {
            name: lobbyName.trim(),
            public: lobbyVisibility,
            password: lobbyPassword
        });
    };

    const handleCreateLobbyKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            submitCreateLobby();
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <main className='flex flex-col items-center justify-center min-h-screen text-black '>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center gap-4 p-4'>
                <div className='w-full max-w-4xl'>
                    <div className="bg-black bg-opacity-50 rounded-lg shadow-md backdrop-blur-md p-6 text-center">
                        <h1 className='text-2xl font-bold text-white'>Create Lobby</h1>
                        <button className='mt-4 bg-blue-600 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-700 transition-colors' onClick={() => setLobbyPopup(true)}>
                            Create
                        </button>
                    </div>
                    <div className="bg-black bg-opacity-50 rounded-lg shadow-md backdrop-blur-md p-6 mt-8">
                        <h2 className="text-2xl font-bold mb-6 text-center text-white">Active Lobbies</h2>
                        <div className="overflow-y-auto max-h-[60vh] scrollbar-hide grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
                            {lobbies.map((lobby) => (
                                <div key={lobby.id} className="p-4 bg-black bg-opacity-50 rounded-lg shadow-md">
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
                                                className="w-full p-2 bg-black bg-opacity-70 text-white rounded-md border border-gray-600"
                                                value={passwordByLobby[lobby.id] || ''}
                                                onChange={(event) => {
                                                    setPasswordByLobby((prev) => ({
                                                        ...prev,
                                                        [lobby.id]: event.target.value
                                                    }));
                                                }}
                                            />
                                        </div>
                                    )}
                                    <button onClick={() => handleJoinLobby(lobby.id)} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
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
                                    onChange={(event) => setLobbyName(event.target.value)}
                                    onKeyDown={handleCreateLobbyKeyDown}
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='text-white'>Visibility</label>
                                <div className='flex items-center gap-4 mt-2'>
                                    <button className={`flex items-center gap-2 p-2 rounded-md ${lobbyVisibility ? 'bg-blue-500' : 'bg-gray-700'}`} onClick={() => handleVisibilityChange(true)}>
                                        <FaEye />
                                        <span>Public</span>
                                    </button>
                                    <button className={`flex items-center gap-2 p-2 rounded-md ${!lobbyVisibility ? 'bg-blue-500' : 'bg-gray-700'}`} onClick={() => handleVisibilityChange(false)}>
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
                                            onChange={(event) => setLobbyPassword(event.target.value)}
                                        />
                                        <FaLock className='absolute right-3 top-3 text-gray-400' />
                                    </div>
                                </div>
                            )}
                            <button className='text-white bg-blue-500 p-2 w-full rounded-md text-lg mt-4' onClick={submitCreateLobby}>
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
