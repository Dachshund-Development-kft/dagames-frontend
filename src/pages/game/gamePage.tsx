import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../../api/socket';
import Loading from '../../components/loading';

const GamePage: React.FC = () => {
    const { id: matchid } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [myHealth, setMyHealth] = useState<number>(100);
    const [enemyHealth, setEnemyHealth] = useState<number>(100);
    const [myMessage, setMyMessage] = useState<string>('sigma');
    const [enemyMessage, setEnemyMessage] = useState<string>('sigma');
    const [winner, setWinner] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [startDates, setStartDates] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [rounds, setRounds] = useState<number>(0);
    const [myPoints, setMyPoints] = useState<number>(2)
    const [enemyPoints, setEnemyPoints] = useState<number>(2)
    const [playerInfo, setPlayerInfo] = useState<{
        char: string | undefined;
        character: { name: string; icon: string; type: string };
        weapon: { name: string; icon: string; type: string };
    } | null>(null);
    const [enemyInfo, setEnemyInfo] = useState<{
        character: { name: string; icon: string; type: string };
        weapon: { name: string; icon: string; type: string };
    } | null>(null);

    useEffect(() => {
        if (matchid === 'undefined') {
            window.location.href = '/play';
        }

        const localMatchId = localStorage.getItem('game_id');
        const localToken = localStorage.getItem('game_token');

        let yourid;
        console.log(yourid);

        const handleGameAuth = (data: any) => {
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
        };

        const handleGameInfo = (data: any) => {
            setPlayerInfo(data.player);
            setEnemyInfo(data.enemy);

            setStartDate(new Date(data.match.startTime));
            setRounds(data.match.rounds);
        };

        const handleGameUpdate = (data: any) => {
            if (data.players) {
                const player2 = data.players[1];   const myId = localStorage.getItem('user_id');
                const player1 = data.players[0];
             

                if (player1.id === myId) {
                    setMyHealth(player1.health);
                    setMyPoints(player1.power);
                    setEnemyHealth(player2.health);
                    setEnemyPoints(player2.power);
                } else {
                    setMyHealth(player2.health);
                    setMyPoints(player2.power);
                    setEnemyHealth(player1.health);
                    setEnemyPoints(player1.power);
                }
            }

            if (data.match) {
                setRounds(data.match.rounds);
            }

            if (data.message) {
                setMyMessage(data.message);
            }

            if (data.enemy_action) {
                setEnemyMessage(data.message);
            }

            if (data.winner) {
                setWinner(data.winner);
            }

            if (data.match_over) {
                setTimeout(() => {
                    localStorage.removeItem('game_id');
                    localStorage.removeItem('game_token');
                    window.location.href = `/?id=${matchid}`;
                }, 500);
            }
        };

        socket.on('auth', (data) => {
            if (data.success) {
                if (localMatchId) {
                    if (localMatchId === matchid) {
                        socket.emit('game_auth', { token: localToken, id: localMatchId });
                    } else {
                        localStorage.removeItem('game_id');
                        localStorage.removeItem('game_token');
                        window.location.href = '/play';
                    }
                }
            }
        });

        socket.on('game_auth', handleGameAuth);
        socket.on('game_info', handleGameInfo);
        socket.on('game_update', handleGameUpdate);

        setLoading(false);

        return () => {
            socket.off('game_auth', handleGameAuth);
            socket.off('game_info', handleGameInfo);
            socket.off('game_update', handleGameUpdate);
        };
    }, [matchid]);

    const handleAction = useCallback((action: string) => {
        socket.emit('player_action', action);
    }, []);

    if (loading) {
        return <Loading />;
    }

    const timer = setInterval(() => {
        if (startDate) {
            const currentDate = new Date();
            const diff = Math.abs(startDate.getTime() - currentDate.getTime());
            const minutes = Math.floor(diff / 60000);
            const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

            const year = startDate.getFullYear();
            const month = String(startDate.getMonth() + 1).padStart(2, '0');
            const day = String(startDate.getDate()).padStart(2, '0');
            const hours = String(startDate.getHours()).padStart(2, '0');
            const minutesDate = String(startDate.getMinutes()).padStart(2, '0');
            const secondsDate = String(startDate.getSeconds()).padStart(2, '0');

            setStartDates(`${year}.${month}.${day} ${hours}:${minutesDate}:${secondsDate}`);
            const timeLeft = `${minutes} perc ${seconds} másodperc`;
            
            setStartTime(timeLeft);
        }
    }, 1000);

    if (winner) {
        clearInterval(timer);
    }

    return (
        <>
            <main className='flex flex-col items-center justify-center min-h-screen text-white'>
                <div className='fixed top-0 bg-black bg-opacity-50 backdrop-blur-md m-5 p-12 rounded-md text-center'>
                    <p className='text-xl font-bold'>Mérkőzés:</p>
                    <p>Kezdés: {startDates}</p>
                    <p>Eltelt idő: {startTime}</p>
                    <p>Körök száma: {rounds}</p>
                </div>
                <div className='absolute top-4 right-4 bg-black bg-opacity-50 rounded-lg p-4'>
                    <h2 className='text-xl font-bold'>Ellenfél</h2>
                    <p>Életerő: {enemyHealth}</p>
                    <p>Power: {enemyPoints}</p>
                    {enemyInfo && (
                        <div className='mt-2'>
                            <img src={enemyInfo.character.icon} alt={enemyInfo.character.name} className='w-16 h-16' />
                            <p>{enemyInfo.character.name}</p>
                            <img src={enemyInfo.weapon.icon} alt={enemyInfo.weapon.name} className='w-16 h-16' />
                            <p>{enemyInfo.weapon.name}</p>
                        </div>
                    )}
                </div>

                <div className='absolute bottom-4 left-4 bg-black bg-opacity-50 rounded-lg p-4'>
                    <h2 className='text-xl font-bold'>Te</h2>
                    <p>Életerőd: {myHealth}</p>
                    <p>Power: {myPoints}</p>
                    {playerInfo && (
                        <div className='mt-2'>
                            <img src={playerInfo.character.icon} alt={playerInfo.character.name} className='w-16 h-16' />
                            <p>{playerInfo.character.name}</p>
                            <img src={playerInfo.weapon.icon} alt={playerInfo.weapon.name} className='w-16 h-16' />
                            <p>{playerInfo.weapon.name}</p>
                        </div>
                    )}
                </div>

                <div className='bg-black bg-opacity-50 p-4 rounded-lg'>
                    {playerInfo && enemyInfo && (
                        <div className='flex justify-center items-center gap-8 mt-16'>
                            <img src={playerInfo.character.icon} alt={playerInfo.character.name} className='w-32 h-32' />
                            <img src={enemyInfo.character.icon} alt={enemyInfo.character.name} className='w-32 h-32' />
                        </div>
                    )}

                    <div className='mt-8 text-center'>
                    <p className='text-lg'>{myMessage}</p>
                    <p className='text-lg'>{enemyMessage}</p>
                    </div>

                    <div className='flex justify-center items-center gap-4 mt-8'>
                        {winner ? (
                            <p className='text-2xl font-bold mt-8'>
                                {winner === localStorage.getItem('user_id') ? 'Nyertél!' : 'Vesztettél!'}
                            </p>
                        ) : (
                            <div className='mt-8'>
                                <button
                                    className='bg-blue-500 text-white px-6 py-3 rounded-lg mr-4 hover:bg-blue-600 transition-colors'
                                    onClick={() => handleAction('normal_attack')}
                                >
                                    Normal Támadás
                                </button>
                                <button
                                    className='bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors'
                                    onClick={() => handleAction('strong_attack')}
                                >
                                    Speciális Támadás
                                </button>
                                <button
                                    className='bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors'
                                    onClick={() => handleAction('weak_attack')}
                                >
                                    Gyenge Támadás
                                </button>

                                <button
                                    className='bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors'
                                    onClick={() => handleAction('defend')}
                                >
                                    Védekezés
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default GamePage;