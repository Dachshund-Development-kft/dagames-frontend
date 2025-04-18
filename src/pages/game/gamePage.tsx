import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import socket from '../../api/socket';
import Loading from '../../components/loading';
import ProgressBar from '../../components/progressBar';
import ProfilePopout from '../../components/ProfilePopout';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';

const GamePage: React.FC = () => {
    const { id: matchid } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [myHealth, setMyHealth] = useState<number>(100);
    const [enemyHealth, setEnemyHealth] = useState<number>(100);
    const [message0, setMessage0] = useState<string>('');
    const [message1, setMessage1] = useState<string>('');
    const [winner, setWinner] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [rounds, setRounds] = useState<number>(0);
    const [myPoints, setMyPoints] = useState<number>(5);
    const [enemyPoints, setEnemyPoints] = useState<number>(5);
    const [myId, setMyId] = useState<string>('');
    const [enemyId, setEnemyId] = useState<string>('');
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [myActionChosen, setMyActionChosen] = useState<boolean>(false);
    const [enemyActionChosen, setEnemyActionChosen] = useState<boolean>(false);
    const [cards, setCards] = useState<string[]>([]);
    const [enemyCards, setEnemyCards] = useState<number>(0);
    const [playerInfo, setPlayerInfo] = useState<{
        char: string | undefined;
        character: { name: string; icon: string; type: string };
        weapon: { name: string; icon: string; type: string };
    } | null>(null);
    const [enemyInfo, setEnemyInfo] = useState<{
        character: { name: string; icon: string; type: string };
        weapon: { name: string; icon: string; type: string };
    } | null>(null);

    const myIdRef = useRef<string>(myId);
    useEffect(() => { myIdRef.current = myId; }, [myId]);

    const handleAction = useCallback((action: string) => {
        socket.emit('player_action', action);
        setMyActionChosen(true);
    }, []);

    const getCardImage = (cardType: string, disabled: boolean) => {
        const baseName = {
            defend: 'defendCard',
            normal_attack: 'normalCard',
            strong_attack: 'strongAttack',
            weak_attack: 'weakAttack',
        }[cardType] || '';

        return `/cards/${baseName}${disabled ? 'Disabled' : ''}.png`;
    };

    const DraggableCard: React.FC<{ card: string; disabled: boolean }> = React.memo(({ card, disabled }) => {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: 'action',
            item: { action: card },
            canDrag: !disabled,
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));

        return (
            <div ref={drag as unknown as React.RefObject<HTMLDivElement>} className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} style={{ opacity: isDragging ? 0.5 : 1 }} >
                <img src={getCardImage(card, disabled)} alt={card} className="w-32 h-40 object-contain" />
                {disabled && <div className="absolute inset-0 " />}
            </div>
        );
    });

    const CARD_COSTS: Record<string, number> = {
        normal_attack: 3,
        strong_attack: 8,
        weak_attack: 2,
        defend: 3,
    };

    useEffect(() => {
        const localMatchId = localStorage.getItem('game_id');
        const localToken = localStorage.getItem('game_token');

        const handleGameAuth = (data: any) => {
            if (data.success) {
                console.log('Game auth success');
            } else {
                localStorage.removeItem('game_id');
                localStorage.removeItem('game_token');
                window.location.href = '/play';
            }
        };

        const handleGameInfo = (data: any) => {
            setPlayerInfo(data.player);
            setEnemyInfo(data.enemy);
            setMyId(data.player.id);
            setEnemyId(data.enemy.id);
            setStartDate(new Date(data.match.startTime));
            setRounds(data.match.rounds);
            setCards(data.player.cards || []);
            setEnemyCards(data.enemy.cards.length);
        };

        const handleGameUpdate = (data: any) => {
            if (data.players) {
                const player1 = data.players[0];
                const player2 = data.players[1];

                const me = player1.id === myIdRef.current ? player1 : player2;
                const enemy = player1.id === myIdRef.current ? player2 : player1;

                setMyHealth(me.health);
                setMyPoints(me.energy);
                setEnemyHealth(enemy.health);
                setEnemyPoints(enemy.energy);
                setCards(me.cards || []);
                setEnemyCards(enemy.cards.length);
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
                if (data.action.playerId === myIdRef.current) {
                    setMyActionChosen(true);
                } else {
                    setEnemyActionChosen(true);
                }
            } else if (data.error) {
                toast.error(data.error);
                setMyActionChosen(false);
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

    useEffect(() => {
        if (isMobile || window.innerWidth < 720) {
            alert('You cannot play on mobile.');
            window.location.href = '/';
        }
    }, []);

    useEffect(() => {
        if (!startDate || winner) return;

        const timer = setInterval(() => {
            const currentDate = new Date();
            const diff = currentDate.getTime() - startDate.getTime();
            const minutes = Math.floor(diff / 60000);
            const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
            setStartTime(`${minutes} perc ${seconds} másodperc`);
        }, 1000);

        return () => clearInterval(timer);
    }, [startDate, winner]);

    if (loading) {
        return <Loading />;
    }

    const handlePlayerClick = (playerId: string) => {
        setSelectedPlayerId(playerId);
    };

    const handleCloseProfilePopout = () => {
        setSelectedPlayerId(null);
    };

    const ActionDropArea = React.memo(() => {
        const [canDrop ,drop] = useDrop(() => ({
            accept: 'action',
            drop: (item: { action: string }) => handleAction(item.action),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop(),
            }),
        }));

        return (
            <div ref={drop as unknown as React.RefObject<HTMLDivElement>}
                className={`p-4 rounded-lg flex flex-col items-center justify-center text-center ${canDrop ? 'border-2 border-dotted border-green-500' : ''}`}>
                {playerInfo && enemyInfo && (
                    <>
                        <div className='flex justify-center items-center gap-8 mt-16'>
                            <img src={`/characters/${playerInfo.character.name.toLowerCase()}${playerInfo.weapon.name}.png`} alt={playerInfo.character.name} className='w-42 h-64' style={{ transform: 'scaleX(-1)' }} />
                            <img src={`/characters/${enemyInfo.character.name.toLowerCase()}${enemyInfo.weapon.name}.png`} alt={enemyInfo.character.name} className='w-42 h-64' />
                        </div>

                        <div className='mt-4 text-center'>
                            <p className='text-lg'>{message0}</p>
                            <p className='text-lg'>{message1}</p>
                        </div>
                    </>
                )}
            </div>
        );
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <main className='flex flex-col items-center justify-center min-h-screen text-white' style={{ backgroundImage: 'url(/background.svg)', backgroundSize: 'cover' }}>
                <div className='absolute top-4 right-4'>
                    <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-lg p-4">
                        <h2 className='text-xl font-bold mb-2'>Enemy Cards</h2>
                        <div className='flex flex-wrap gap-2'>
                            {Array.from({ length: enemyCards }).map((_, i) => (
                                <img key={i} src="/cards/blankCard.png" alt="Enemy Card" className="w-32 h-40 object-contain" />
                            ))}
                        </div>
                    </div>
                    <div className='mt-4 bg-black bg-opacity-50 backdrop-blur-md rounded-lg p-4 w-min ml-auto' onClick={() => handlePlayerClick(enemyId)}>
                        <h2 className='text-xl font-bold'>Enemy {enemyActionChosen && <span className="text-green-500">✔</span>}</h2>
                        <div className='flex items-center gap-4'>
                            <div>
                                <div className='my-4'>
                                    <ProgressBar value={enemyHealth} max={100} startColor="#FF0000" endColor="#00FF00" length="200px" showValue numberType="hp" />
                                </div>
                                <div>
                                    <ProgressBar value={enemyPoints} max={10} startColor="#800080" endColor="##0000ff" length="200px" showValue numberType="power" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='absolute bottom-4 left-4'>
                    <div className='mb-4 bg-black bg-opacity-50 backdrop-blur-md rounded-lg p-4 w-min' onClick={() => handlePlayerClick(myId)}>
                        <h2 className='text-xl font-bold'>You {myActionChosen && <span className="text-green-500">✔</span>}</h2>
                        <div className='flex items-center gap-4'>
                            <div>
                                <div className='my-4'>
                                    <ProgressBar value={myHealth} max={100} startColor="#FF0000" endColor="#00FF00" length="200px" showValue numberType="hp" />
                                </div>
                                <div>
                                    <ProgressBar value={myPoints} max={10} startColor="#800080" endColor="##0000ff" length="200px" showValue numberType="power" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-lg p-4">
                        <div className='flex gap-4 mb-2'>
                            <h2 className='text-xl font-bold mb-2'>Your Cards</h2>
                            <button onClick={() => handleAction('rest')} className="px-3 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50" disabled={myActionChosen} >
                                Rest
                            </button>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {cards.map((card, index) => {
                                const disabled = myPoints < (CARD_COSTS[card] || 0) || myActionChosen;
                                return <DraggableCard key={`${card}-${index}`} card={card} disabled={disabled} />;
                            })}
                        </div>
                    </div>
                </div>

                <div className='absolute top-4 left-4 text-center bg-white bg-opacity-30 p-4 rounded-lg'>
                    <p><span className='font-bold'>Time:</span> {startTime}</p>
                    <p><span className='font-bold'>Rounds:</span> {rounds}</p>
                </div>

                <div className='p-4 rounded-lg'>
                    <ActionDropArea />
                </div>

                {selectedPlayerId && (
                    <>
                        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40' onClick={handleCloseProfilePopout} />
                        <ProfilePopout playerId={selectedPlayerId} />
                    </>
                )}
            </main>
        </DndProvider>
    );
};

export default GamePage;