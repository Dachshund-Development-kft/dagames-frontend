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

    useEffect(() => {
        if (!socket) {
            alert('Socket not connected');
        }

        socket.emit('auth', { token: localStorage.getItem('token') });

        socket.on('lobby_update', (data: any) => {
            if (data.players) {
                setPlayers(data.players || []);
            } else if (data.ready) {
                setReadyPlayers(data.ready);
            } else {
                console.log('Failed to update lobby');
            }
        });

        socket.on('lobby_message', (data: any) => {
            console.log(data.message);
        });

        socket.on('countdown', (data: any) => {
            console.log(data.message);

            if (data.success) {
                const id = data.id
                const token = data.token

                if (localStorage.getItem('game_id') || localStorage.getItem('game_token')) {
                    localStorage.removeItem('game_id');
                    localStorage.removeItem('game_token');
                    console.log('Miért is volt ez neked fiam. Gém adat remúvolva');

                    localStorage.setItem('game_id', id);
                    localStorage.setItem('game_token', token);
                    window.location.href = '/game/' + id
                } else {
                    localStorage.setItem('game_id', id);
                    localStorage.setItem('game_token', token);
                    window.location.href = '/game/' + id
                }
            } else {
                return console.log('Mi a sigma');
            }
        });

        socket.on('ready', (data: any) => {
            if (data.success) {
                setReady(true);
            } else {
                console.log('Failed to ready');
            }
        });

        socket.on('unready', (data: any) => {
            if (data.success) {
                setReady(false);
            } else {
                console.log('Failed to unready');
            }
        });

        socket.on('lobby_deleted', () => {
            console.log('Lobby deleted');
            window.location.href = '/play';
        });

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
                    return window.location.href = '/play';
                }

                socket.emit('join', { id: data.id });
                localStorage.setItem('lobby_id', data.id);
            } catch (err) {
                console.error('Failed to fetch lobby data:', err);
                setLoading(false);
                return window.location.href = '/play';
            }
        };

        fetchLobbyData();
    }, [id]);

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

    const handleReady = async () => {
        const id = window.location.pathname.split('/')[2];
        socket.emit('ready', { id: id });

        socket.on('ready', (data: any) => {
            if (data.success) {
                console.log('Ready');
            }
        });

        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 3000);
    }

    const handleUnready = async () => {
        const id = window.location.pathname.split('/')[2];
        setIsButtonDisabled(true);
        socket.emit('unready', { id: id });

        socket.on('unready', (data: any) => {
            if (data.success) {
                console.log('Unready');
            }
        });

        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 3000);
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
                <div className='flex flex-grow items-center justify-center gap-4'>
                    <h1 className='text-2xl font-bold text-white'>Lobby: {lobbyData.name}</h1>
                    <div className='bg-[#1E1F25] p-4 rounded-lg w-96'>
                        <h2 className='text-xl font-bold text-white mb-4'>Players in Lobby</h2>
                        <ul className='text-white'>
                            {players && players.map((player, index) => (
                                <li key={index} className='flex items-center gap-2 mb-2'>
                                    <span style={{ color: readyPlayers.includes(player) ? 'green' : 'white' }}>
                                        {player}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={leaveLobby} className='bg-[#FF4D4F] text-white px-4 py-2 rounded-lg mt-4'>Leave Lobby</button>
                        <br />
                        {ready && (
                            <button onClick={handleUnready} disabled={isButtonDisabled} className='bg-[#20d523] text-white px-4 py-2 rounded-lg mt-4'>Unready</button>
                        ) || (
                                <button onClick={handleReady} disabled={isButtonDisabled} className='bg-[#20d523] text-white px-4 py-2 rounded-lg mt-4'>Ready</button>
                            )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default PlayPageID;