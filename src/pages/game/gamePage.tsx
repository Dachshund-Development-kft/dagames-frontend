import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import socket from '../../api/socket';
import Loading from '../../components/loading';
import ProgressBar from '../../components/progressBar';
import ProfilePopout from '../../components/ProfilePopout';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';

const GamePage: React.FC = () => {
    const { id: matchid } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [myHealth, setMyHealth] = useState<number>(100);
    const [enemyHealth, setEnemyHealth] = useState<number>(100);
    const [message0, setMessage0] = useState<string>('');
    const [message1, setMessage1] = useState<string>('');
    const [winner, setWinner] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [startDates, setStartDates] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [rounds, setRounds] = useState<number>(0);
    const [myPoints, setMyPoints] = useState<number>(2)
    const [enemyPoints, setEnemyPoints] = useState<number>(2)
    const [myId, setMyId] = useState<string>('');
    const [enemyId, setEnemeyId] = useState<string>('');
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [myActionChosen, setMyActionChosen] = useState<boolean>(false);
    const [enemyActionChosen, setEnemyActionChosen] = useState<boolean>(false);
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 });

    const [playerInfo, setPlayerInfo] = useState<{
        char: string | undefined;
        character: { name: string; icon: string; type: string };
        weapon: { name: string; icon: string; type: string };
    } | null>(null);
    const [enemyInfo, setEnemyInfo] = useState<{
        character: { name: string; icon: string; type: string };
        weapon: { name: string; icon: string; type: string };
    } | null>(null);

    const handleAction = useCallback((action: string) => {
        socket.emit('player_action', action);
        setMyActionChosen(true);
    }, []);

    const ActionCard: React.FC<{ action: string; label: string; bgColor: string }> = ({ action, label, bgColor }) => {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: 'action',
            item: { action },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));

        return (
            <div
                ref={drag}
                className={`${bgColor} text-white px-6 py-3 rounded-lg cursor-pointer hover:${bgColor}-600 transition-colors`}
                style={{ opacity: isDragging ? 0.5 : 1 }}
            >
                {label}
            </div>
        );
    };

    const ActionDropArea = () => {
        const [{ canDrop, isOver }, drop] = useDrop(() => ({
            accept: 'action',
            drop: (item: { action: string }) => handleAction(item.action),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop(),
            }),
        }));

        return (
            <div
                ref={drop}
                className={`p-4 border-2 h-28 w-80 border-dashed ${canDrop ? 'border-green-500' : 'border-gray-500'} rounded-lg flex items-center justify-center text-center`}
            >
                {isOver ? 'Release to perform action' : 'Drag action here'}
            </div>
        );
    };

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
            setMyId(data.player.id);
            setEnemeyId(data.enemy.id);

        };

        const handleGameUpdate = (data: any) => {
            if (data.players) {
                const player2 = data.players[1];
                const player1 = data.players[0];
        
                const myId = localStorage.getItem('user_id');
        
                if (player1.id === myId) {
                    setMyHealth(player1.health);
                    setMyPoints(player1.power);
                    setMyId(player1.id);
                    setEnemyHealth(player2.health);
                    setEnemyPoints(player2.power);
                    setEnemeyId(player2.id);
                } else {
                    setMyHealth(player2.health);
                    setMyPoints(player2.power);
                    setMyId(player2.id);
                    setEnemyHealth(player1.health);
                    setEnemyPoints(player1.power);
                    setEnemeyId(player1.id);
                }
            }
        
            if (data.match) {
                setRounds(data.match.rounds);
            }
        
            if (data.messages) {
                setMessage0(data.messages[0]);
                setMessage1(data.messages[1]);
                setMyActionChosen(false);
                setEnemyActionChosen(false);
            }
        
            if (data.winner) {
                setWinner(data.winner);
            }
        
            if (data.action) {
                if (data.action.playerId === myId) {
                    setMyActionChosen(true);
                } else {
                    setEnemyActionChosen(true);
                }
            } else if (data.error) {
                toast.error(data.error);
            }
        
            if (data.self_action) {
                setMyActionChosen(true);
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

    const handlePlayerClick = (playerId: string) => {
        setSelectedPlayerId(playerId);
    };

    const handleCloseProfilePopout = () => {
        setSelectedPlayerId(null);
    };

    if (!isDesktopOrLaptop) {
        return (
            <>
                <main className='flex flex-col items-center justify-center min-h-screen text-white'>
                    <div className='toprow flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-md rounded-md'>
                        <div className=' p-4 text-center'>
                            <p className='text-xl font-bold'>Fight:</p>
                            <p>Start: {startDates}</p>
                            <p>Elapsed time: {startTime}</p>
                            <p>Number of rounds: {rounds}</p>
                        </div>
                    </div>

                    <div className="middlerow flex items-center justify-center p-4">
                        <div className='bg-black bg-opacity-50 p-4 rounded-lg'>
                            {playerInfo && enemyInfo && (
                                <div className='flex justify-center items-center gap-8 mt-16'>
                                    <img src={playerInfo.character.icon} alt={playerInfo.character.name} className='w-32 h-32  ' style={{ WebkitTransform: 'scaleX(-1)', transform: 'scaleX(-1)' }} />
                                    <img src={enemyInfo.character.icon} alt={enemyInfo.character.name} className='w-32 h-32  ' />
                                </div>
                            )}

                            <div className='mt-8 text-center'>
                                <p className='text-lg'>{message0}</p>
                                <p className='text-lg'>{message1}</p>
                            </div>

                            <div className='flex justify-center items-center gap-4 mt-8'>
                                {winner ? (
                                    <p className='text-2xl font-bold mt-8'>
                                        {winner === localStorage.getItem('user_id') ? 'Nyertél!' : 'Vesztettél!'}
                                    </p>
                                ) : (
                                    <div className='mt-8'>
                                        <button className='bg-blue-500 text-white px-6 py-3 rounded-lg mr-4 hover:bg-blue-600 transition-colors' onClick={() => handleAction('normal_attack')} >
                                            Normal attack
                                        </button>
                                        <button className='bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors' onClick={() => handleAction('strong_attack')} >
                                            Special attack
                                        </button>
                                        <button className='bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors' onClick={() => handleAction('weak_attack')} >
                                            Weak attack
                                        </button>

                                        <button className='bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors' onClick={() => handleAction('defend')} >
                                            Defend
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center p-4 gap-4 bg-black bg-opacity-50 backdrop-blur-md rounded-md">
                        <div className='bg-black bg-opacity-50 rounded-lg p-4' onClick={() => handlePlayerClick(myId)}>
                            <h2 className='text-xl font-bold'>You {myActionChosen && <span className="text-green-500">✔</span>}</h2>
                            <p>Health: {myHealth}</p>
                            <ProgressBar value={myHealth} max={100} startColor="#FF0000" endColor="#00FF00" />
                            <p>Power: {myPoints}</p>
                            <ProgressBar value={myPoints} max={5} startColor="#800080" endColor="##0000ff" />
                            {playerInfo && (
                                <div className='mt-2'>
                                    <img src={playerInfo.character.icon} alt={playerInfo.character.name} className='w-16 h-16  ' />
                                    <p>{playerInfo.character.name}</p>
                                    <img src={playerInfo.weapon.icon} alt={playerInfo.weapon.name} className='w-16 h-16  ' />
                                    <p>{playerInfo.weapon.name}</p>
                                </div>
                            )}
                        </div>
                        <div className='bg-black bg-opacity-50 rounded-lg p-4' onClick={() => handlePlayerClick(enemyId)}>
                            <h2 className='text-xl font-bold'>Enemy {enemyActionChosen && <span className="text-green-500">✔</span>}</h2>
                            <p>Health: {enemyHealth}</p>
                            <ProgressBar value={enemyHealth} max={100} startColor="#FF0000" endColor="#00FF00" />
                            <p>Power: {enemyPoints}</p>
                            <ProgressBar value={enemyPoints} max={5} startColor="#800080" endColor="##0000ff" />
                            {enemyInfo && (
                                <div className='mt-2'>
                                    <img src={enemyInfo.character.icon} alt={enemyInfo.character.name} className='w-16 h-16  ' />
                                    <p>{enemyInfo.character.name}</p>
                                    <img src={enemyInfo.weapon.icon} alt={enemyInfo.weapon.name} className='w-16 h-16  ' />
                                    <p>{enemyInfo.weapon.name}</p>
                                </div>
                            )}
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
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <main className='flex flex-col items-center justify-center min-h-screen text-white'>
                <div className='fixed top-0 bg-black bg-opacity-50 backdrop-blur-md m-5 p-12 rounded-md text-center'>
                    <p className='text-xl font-bold'>Fight:</p>
                    <p>Start: {startDates}</p>
                    <p>Elapsed time: {startTime}</p>
                    <p>Number of rounds: {rounds}</p>
                </div>
                <div className='absolute top-4 right-4 bg-black bg-opacity-50 rounded-lg p-4' onClick={() => handlePlayerClick(enemyId)}>
                    <h2 className='text-xl font-bold'>Enemy {enemyActionChosen && <span className="text-green-500">✔</span>}</h2>
                    <p>Health: {enemyHealth}</p>
                    <ProgressBar value={enemyHealth} max={100} startColor="#FF0000" endColor="#00FF00" />
                    <p>Power: {enemyPoints}</p>
                    <ProgressBar value={enemyPoints} max={5} startColor="#800080" endColor="##0000ff" />
                    {enemyInfo && (
                        <div className='mt-2'>
                            <img src={enemyInfo.character.icon} alt={enemyInfo.character.name} className='w-16 h-16  ' />
                            <p>{enemyInfo.character.name}</p>
                            <img src={enemyInfo.weapon.icon} alt={enemyInfo.weapon.name} className='w-16 h-16  ' />
                            <p>{enemyInfo.weapon.name}</p>
                        </div>
                    )}
                </div>

                <div className='absolute bottom-4 left-4 bg-black bg-opacity-50 rounded-lg p-4' onClick={() => handlePlayerClick(myId)}>
                    <h2 className='text-xl font-bold'>You {myActionChosen && <span className="text-green-500">✔</span>}</h2>
                    <p>Health: {myHealth}</p>
                    <ProgressBar value={myHealth} max={100} startColor="#FF0000" endColor="#00FF00" />
                    <p>Power: {myPoints}</p>
                    <ProgressBar value={myPoints} max={5} startColor="#800080" endColor="##0000ff" />
                    {playerInfo && (
                        <div className='mt-2'>
                            <img src={playerInfo.character.icon} alt={playerInfo.character.name} className='w-16 h-16  ' />
                            <p>{playerInfo.character.name}</p>
                            <img src={playerInfo.weapon.icon} alt={playerInfo.weapon.name} className='w-16 h-16  ' />
                            <p>{playerInfo.weapon.name}</p>
                        </div>
                    )}
                </div>

                <div className='bg-black bg-opacity-50 p-4 rounded-lg'>
                    {playerInfo && enemyInfo && (
                        <div className='flex justify-center items-center gap-8 mt-16'>
                            <img src={playerInfo.character.icon} alt={playerInfo.character.name} className='w-32 h-32  ' style={{ WebkitTransform: 'scaleX(-1)', transform: 'scaleX(-1)' }} />
                            <img src={enemyInfo.character.icon} alt={enemyInfo.character.name} className='w-32 h-32  ' />
                        </div>
                    )}

                    <div className='mt-8 text-center'>
                        <p className='text-lg'>{message0}</p>
                        <p className='text-lg'>{message1}</p>
                    </div>

                    <div className='flex justify-center items-center gap-4 mt-8'>
                        {winner ? (
                            <p className='text-2xl font-bold mt-8'>
                                {winner === localStorage.getItem('user_id') ? 'You won!' : 'You lost!'}
                            </p>
                        ) : (
                            <div className='mt-8 flex flex-wrap justify-center gap-4' style={{ maxWidth: '400px' }}>
                                <ActionDropArea />
                                <ActionCard action="normal_attack" label="Normal attack" bgColor="bg-blue-500" />
                                <ActionCard action="strong_attack" label="Special attack" bgColor="bg-red-500" />
                                <ActionCard action="weak_attack" label="Weak attack" bgColor="bg-yellow-500" />
                                <ActionCard action="defend" label="Defend" bgColor="bg-green-500" />

                            </div>
                        )}
                    </div>
                </div>
                {selectedPlayerId && (
                    <>
                        <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={handleCloseProfilePopout} />
                        <ProfilePopout playerId={selectedPlayerId} />
                    </>
                )}
            </main>
        </DndProvider>
    );
};

export default GamePage;