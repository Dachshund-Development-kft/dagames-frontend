import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavLayoutGame from '../../components/nav';
import socket from '../../api/socket';
import Loading from '../../components/loading';
import { lobbyId } from '../../api/lobby';
import { user } from '../../api/me';
import ProfilePopout from '../../components/ProfilePopout';
import { isMobile } from 'react-device-detect';

const PlayPageID: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [lobbyData, setLobbyData] = useState<any>(null);
    const [players, setPlayers] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [ready, setReady] = useState<boolean>(false);
    const [readyPlayers, setReadyPlayers] = useState<string[]>([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
    const [countdown, setCountdown] = useState<number>(0);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

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
            if (data.success) {
                const id = data.id;
                const token = data.token;

                localStorage.removeItem('game_id');
                localStorage.removeItem('game_token');
                localStorage.setItem('game_id', id);
                localStorage.setItem('game_token', token);
                window.location.href = `/game/${id}`;
            } else if (data.message > 0 && data.message <= 5) {
                console.log(`Game starting in ${data.message} seconds!`);
                setCountdown(data.message);
            } else {
                console.log('Failed to start game');
                setCountdown(0);
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

        const joinLobby = (data: any) => {
            if (!data.success) {
                window.location.reload()
            } else {
                return;
            }
        }

        socket.on('join_lobby', joinLobby)
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
                const username = await user(playerId);
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
        }, 500);
    };

    const handleUnready = async () => {
        const id = window.location.pathname.split('/')[2];
        setIsButtonDisabled(true);
        socket.emit('unready', { id: id });

        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 500);
    };

    const handlePlayerClick = (playerId: string) => {
        setSelectedPlayerId(playerId);
    };

    const handleCloseProfilePopout = () => {
        setSelectedPlayerId(null);
    };

    if (isMobile) {
        alert('You cant open this on mobile');
        window.location.href = '/';
    }

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
                <div className='flex flex-grow items-center justify-center gap-4 px-4'>
                    <div className='bg-black bg-opacity-50 rounded-lg shadow-md backdrop-blur-md p-6'>
                        <h1 className='text-2xl text-white mb-4 text-center'>Lobby: <span className='font-bold'>{lobbyData.name}</span></h1>
                        <div className='overflow-y-auto max-h-[60vh] scrollbar-hide gap-4'>
                            {countdown > 0 && (
                                <h1 className='text-xl text-white mb-4 text-center'>Countdown: {countdown}</h1>
                            )}
                            <h2 className='text-xl text-white mb-4 text-center'>Players in Lobby</h2>
                            <ul className='text-white'>
                                {players.map((player, index) => (
                                    <li key={index} className='flex items-center gap-2 mb-2'>
                                        <span onClick={() => handlePlayerClick(player)} style={{ color: readyPlayers.includes(player) ? 'green' : 'white', cursor: 'pointer' }} >
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
                                <button onClick={handleUnready} disabled={isButtonDisabled} className={`bg-[#20d523] text-white px-4 py-2 rounded-lg mt-4 ${isButtonDisabled ? ' cursor-not-allowed' : ''}`}>
                                    Unready
                                </button>
                            ) : (
                                <button onClick={handleReady} disabled={isButtonDisabled} className={`bg-[#20d523] text-white px-4 py-2 rounded-lg mt-4 ${isButtonDisabled ? ' cursor-not-allowed' : ''}`}>
                                    Ready
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {selectedPlayerId && (
                    <>
                        <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={handleCloseProfilePopout} />
                        <ProfilePopout playerId={selectedPlayerId} />
                    </>
                )}
            </main>
        </>
    );
};

export default PlayPageID;