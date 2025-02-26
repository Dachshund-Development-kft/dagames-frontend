import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../../api/socket';
import Loading from '../../components/loading';

const GamePage: React.FC = () => {
    const { id: matchid } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [myHealth, setMyHealth] = useState<number>(25);
    const [enemyHealth, setEnemyHealth] = useState<number>(25);
    const [message, setMessage] = useState<string>('');
    const [winner, setWinner] = useState<string | null>(null);
    const [playerInfo, setPlayerInfo] = useState<{
        character: { name: string; icon: string; type: string };
        weapon: { name: string; icon: string; type: string };
    } | null>(null);
    const [enemyInfo, setEnemyInfo] = useState<{
        character: { name: string; icon: string; type: string };
        weapon: { name: string; icon: string; type: string };
    } | null>(null);
    const [lockbuttons, setLockbuttons] = useState<boolean>(false);

    useEffect(() => {
        socket.emit('auth', { token: localStorage.getItem('token') });

        if (matchid === 'undefined') {
            window.location.href = '/play';
        }

        setTimeout(() => {
            const localMatchId = localStorage.getItem('game_id');
            const localToken = localStorage.getItem('game_token');

            if (localMatchId) {
                if (localMatchId === matchid) {
                    socket.emit('game_auth', { token: localToken, id: localMatchId });
                } else {
                    localStorage.removeItem('game_id');
                    localStorage.removeItem('game_token');
                    window.location.href = '/play';
                }
            }

            let yourid;
            console.log(yourid);

            socket.on('game_auth', (data: any) => {
                if (data.success) {
                    console.log('Game auth success');
                    localStorage.setItem('user_id', data.id);
                    yourid = data.id;
                } else {
                    localStorage.removeItem('game_id');
                    localStorage.removeItem('game_token');
                    console.log('Game auth failed');
                    window.location.href = '/play';
                }
            });

            socket.on('game_info', (data: any) => {
                setPlayerInfo(data.player);
                setEnemyInfo(data.enemy);
            });

            socket.on('game_update', (data: any) => {
                if (data.players) {
                    const myId = localStorage.getItem('user_id');
                    const player1 = data.players[0];
                    const player2 = data.players[1];

                    setLockbuttons(false);

                    if (player1.id === myId) {
                        setMyHealth(player1.health);
                        setEnemyHealth(player2.health);
                    } else {
                        setMyHealth(player2.health);
                        setEnemyHealth(player1.health);
                    }
                }

                if (data.action) {
                    setLockbuttons(true);
                }

                if (data.message) {
                    setMessage(data.message);
                }

                if (data.winner) {
                    setWinner(data.winner);
                }

                if (data.enemy_action) {
                    setMessage(data.message);
                }

                if (data.match_over) {
                    setTimeout(() => {
                        localStorage.removeItem('game_id');
                        localStorage.removeItem('game_token');
                        window.location.href = `/?id=${matchid}`;
                    }, 500);
                }
            });
        }, 1000);

        setLoading(false);
    }, [matchid]);

    const handleAction = (action: string) => {
        socket.emit('player_action', action);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <main className='flex flex-col items-center justify-center min-h-screen'>
                <div className='text-center'>
                    <h1 className='text-2xl font-bold mb-4'>Harc</h1>
                    <div className='mb-4'>
                        <p>Életerőd: {myHealth}</p>
                        <p>Ellenfél életereje: {enemyHealth}</p>
                    </div>
                    {playerInfo && enemyInfo && (
                        <div className='flex justify-around mb-4'>
                            <div>
                                <h2 className='text-xl font-bold'>Te</h2>
                                <img src={playerInfo.character.icon} alt={playerInfo.character.name} className='w-16 h-16' />
                                <p>{playerInfo.character.name}</p>
                                <img src={playerInfo.weapon.icon} alt={playerInfo.weapon.name} className='w-16 h-16' />
                                <p>{playerInfo.weapon.name}</p>
                            </div>
                            <div>
                                <h2 className='text-xl font-bold'>Ellenfél</h2>
                                <img src={enemyInfo.character.icon} alt={enemyInfo.character.name} className='w-16 h-16' />
                                <p>{enemyInfo.character.name}</p>
                                <img src={enemyInfo.weapon.icon} alt={enemyInfo.weapon.name} className='w-16 h-16' />
                                <p>{enemyInfo.weapon.name}</p>
                            </div>
                        </div>
                    )}
                    {winner ? (
                        <p>{winner === localStorage.getItem('user_id') ? 'Nyertél!' : 'Vesztettél!'}</p>
                    ) : (
                        <>
                            <p>{message}</p>
                            <div className='mt-4'>
                                <button
                                    className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
                                    onClick={() => handleAction('attack')}
                                    disabled={lockbuttons}
                                >
                                    Támadás
                                </button>
                                <button
                                    className='bg-green-500 text-white px-4 py-2 rounded'
                                    onClick={() => handleAction('defend')}
                                    disabled={lockbuttons}
                                >
                                    Védekezés
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

export default GamePage;