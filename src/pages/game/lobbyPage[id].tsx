import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavLayoutGame from '../../components/nav';
import socket from '../../api/socket';
import Loading from '../../components/loading';
import { lobbyId } from '../../api/lobby';

const PlayPageID: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [lobbyData, setLobbyData] = useState<any>(null);
    const [players, setPlayers] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [ready, setReady] = useState<boolean>(false);
    const [readyPlayers, setReadyPlayers] = useState<string[]>([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (!socket) {
            alert('Socket not connected');
            return;
        }

        const handleLobbyUpdate = (data: any) => {
            if (data.players) {
                setPlayers(data.players || []);
            } else if (data.ready) {
                setReadyPlayers(data.ready);
            } else {
                console.log('Failed to update lobby');
            }
        };

        const handleLobbyMessage = (data: any) => {
            console.log(data.message);
        };

        const handleCountdown = (data: any) => {
            console.log(data.message);

            if (data.success) {
                const id = data.id;
                const token = data.token;

                localStorage.removeItem('game_id');
                localStorage.removeItem('game_token');
                localStorage.setItem('game_id', id);
                localStorage.setItem('game_token', token);
                window.location.href = `/game/${id}`;
            } else {
                console.log('Countdown failed');
            }
        };

        const handleReady = (data: any) => {
            if (data.success) {
                setReady(true);
            } else {
                console.log('Failed to ready');
            }
        };

        const handleUnready = (data: any) => {
            if (data.success) {
                setReady(false);
            } else {
                console.log('Failed to unready');
            }
        };

        const handleLobbyDeleted = () => {
            console.log('Lobby deleted');
            window.location.href = '/play';
        };

        socket.on('lobby_update', handleLobbyUpdate);
        socket.on('lobby_message', handleLobbyMessage);
        socket.on('countdown', handleCountdown);
        socket.on('ready', handleReady);
        socket.on('unready', handleUnready);
        socket.on('lobby_deleted', handleLobbyDeleted);

        const fetchLobbyData = async () => {
            try {
                if (!id) {
                    throw new Error('Lobby ID is undefined');
                }

                const response = await lobbyId(id);
                const data = response.data;
                setLobbyData(data);
                setPlayers(data.players || []);
                setLoading(false);

                if (!data) {
                    window.location.href = '/play';
                    return;
                }

                socket.emit('join', { id: data.id });
                localStorage.setItem('lobby_id', data.id);
            } catch (err) {
                console.error('Failed to fetch lobby data:', err);
                setLoading(false);
                window.location.href = '/play';
            }
        };

        fetchLobbyData();

        return () => {
            socket.off('lobby_update', handleLobbyUpdate);
            socket.off('lobby_message', handleLobbyMessage);
            socket.off('countdown', handleCountdown);
            socket.off('ready', handleReady);
            socket.off('unready', handleUnready);
            socket.off('lobby_deleted', handleLobbyDeleted);
        };
    }, [id]);

    useEffect(() => {
        const fetchUsernames = async () => {
            const usernameMap: { [key: string]: string } = {};
            for (const playerId of players) {
                const username = await fetchUsername(playerId);
                if (username) {
                    usernameMap[playerId] = username;
                }
            }
            setUsernames(usernameMap);
        };

        fetchUsernames();
    }, [players]);

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
    };

    const handleReady = async () => {
        const id = window.location.pathname.split('/')[2];
        setIsButtonDisabled(true);
        socket.emit('ready', { id: id });

        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 3000);
    };

    const handleUnready = async () => {
        const id = window.location.pathname.split('/')[2];
        setIsButtonDisabled(true);
        socket.emit('unready', { id: id });

        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 3000);
    };

    const fetchUsername = async (userId: string) => {
        try {
            const response = await fetch(`https://api.dagames.online/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                return data.username;
            } else {
                console.error('Failed to fetch username');
            }
        } catch (err) {
            console.error('Failed to fetch username:', err);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!lobbyData) {
        return <div className='text-white'>Lobby not found</div>;
    }

    return (
        <>
            <main className='flex flex-col items-center justify-center min-h-screen'>
                <NavLayoutGame />
                <div className='flex flex-grow items-center justify-center gap-4'>
                    <div className='bg-black bg-opacity-50 rounded-lg shadow-md backdrop-blur-md p-6'>
                        <h1 className='text-2xl font-bold text-white mb-4'>Lobby: {lobbyData.name}</h1>
                        <div className='overflow-y-auto max-h-[60vh] scrollbar-hide gap-4'>
                            <h2 className='text-xl font-bold text-white mb-4'>Players in Lobby</h2>
                            <ul className='text-white'>
                                {players.map((player, index) => (
                                    <li key={index} className='flex items-center gap-2 mb-2'>
                                        <span style={{ color: readyPlayers.includes(player) ? 'green' : 'white' }}>
                                            {usernames[player] || 'Loading...'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <br />
                            <button onClick={leaveLobby} className='bg-[#FF4D4F] text-white px-4 py-2 rounded-lg mt-4 mr-5'>
                                Leave Lobby
                            </button>
                            {ready ? (
                                <button onClick={handleUnready} disabled={isButtonDisabled} className='bg-[#20d523] text-white px-4 py-2 rounded-lg mt-4'>
                                    Unready
                                </button>
                            ) : (
                                <button onClick={handleReady} disabled={isButtonDisabled} className='bg-[#20d523] text-white px-4 py-2 rounded-lg mt-4'>
                                    Ready
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default PlayPageID;