import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavLayoutGame from '../../components/nav';
import { me, badges } from '../../api/me';
import { matches } from '../../api/matches';
import Loading from '../../components/loading';
import ReportPopup from '../../components/reportPopup';

const PlayPage = () => {
    const [user, setUser] = useState<{ username: string; pfp: string; lvl: number; rank: string; badges: any[]; isNew: boolean, xp: number, xpNeeded: number, id: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastMatchData, setLastMatchData] = useState<any>(null);
    const [isReportPopupOpen, setIsReportPopupOpen] = useState(false);
    const [isLastMatchPopupOpen, setIsLastMatchPopupOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching user data for user:', user);
            try {
                const userData = await me();

                try {
                    const badgesResponse = await badges();

                    if (badgesResponse.status === 200) {
                        const badgeData = badgesResponse.data;

                        setUser({
                            ...userData,
                            badges: badgeData
                        });
                    } else {
                        console.error('Failed to fetch badges');
                        setUser({
                            ...userData,
                            badges: []
                        });
                    }

                    setLoading(false);
                } catch (badgeError) {
                    console.error('Error fetching badges:', badgeError);
                    setUser({
                        ...userData,
                        badges: []
                    });
                    setLoading(false);
                }
            } catch (err) {
                localStorage.removeItem('token');
                console.error(err);
                window.location.href = '/login';
            }
        };

        const handleid = async () => {
            const url = window.location.href;
            const matchId = url.split('?id=')[1];
            if (!matchId) return;

            try {
                const response = await matches(matchId);
                console.log(response);
            } catch (err) {
                console.error('Error fetching match data:', err);
            }
        };

        const fetchLastMatch = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('https://api.dagames.online/v1/user/@me/matches', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch last match data');
                }

                const data = await response.json();
                if (data.length > 0) {
                    setLastMatchData(data[0]);
                }
            } catch (err) {
                console.error('Error fetching last match data:', err);
            }
        };

        handleid();
        fetchData();
        fetchLastMatch();
    }, []);

    const handleShowLastMatchPopup = () => {
        setIsLastMatchPopupOpen(true);
    };

    const handleCloseLastMatchPopup = () => {
        setIsLastMatchPopupOpen(false);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <main className='flex flex-col items-center justify-center min-h-screen overflow-hidden'>
            <NavLayoutGame />
            <div className="flex flex-grow items-center justify-center w-full">
                <div className="bg-black bg-opacity-50 backdrop-blur-md p-6 rounded-lg max-w-md w-full text-white flex flex-col space-y-4">
                    <button onClick={() => setIsReportPopupOpen(true)} className="mx-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">
                        Report a bug
                    </button>
                    <button onClick={handleShowLastMatchPopup} className="mx-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300" >
                        Show Last Match
                    </button>
                    <h1 className='mx-auto font-bold px-4 py-2'>
                        <Link to="/tos" >
                            Terms of service and the other things
                        </Link>
                    </h1>
                    {isReportPopupOpen && user && (
                        <ReportPopup onClose={() => setIsReportPopupOpen(false)} userToken={localStorage.getItem('token') || ''} />
                    )}
                </div>
            </div>

            {isLastMatchPopupOpen && lastMatchData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-black bg-opacity-70 backdrop-blur-md p-6 rounded-lg max-w-md w-full text-white">
                        <h2 className="text-2xl font-bold mb-4">Last Match</h2>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold">Players</h3>
                            {lastMatchData.players.map((player: any, index: number) => (
                                <div key={index} className="mb-2">
                                    <p><strong>Character:</strong> {player.character.name}</p>
                                    <p><strong>Health:</strong> {player.health < 0 ? 0 : player.health}</p>
                                    <p><strong>Weapon:</strong> {player.weapon.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold">Result</h3>
                            <p><strong>Winner:</strong> {lastMatchData.players.find((player: any) => player.id === lastMatchData.winner)?.username}</p>
                            <p><strong>Loser:</strong> {lastMatchData.players.find((player: any) => player.id === lastMatchData.loser)?.username}</p>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold">Rank</h3>
                            <p><strong>Your Rank:</strong> {lastMatchData.rank}</p>
                            <p><strong>Average Rank:</strong> {Object.keys(lastMatchData.avarageRank).length === 0 ? "N/A" : lastMatchData.avarageRank}</p>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold">Data</h3>
                            <p><strong>XP:</strong> {lastMatchData.data.xp}</p>
                            <p><strong>Coins:</strong> {lastMatchData.data.coins}</p>
                            <p><strong>Rounds:</strong> {lastMatchData.data.rounds}</p>
                        </div>
                        <button
                            onClick={handleCloseLastMatchPopup}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default PlayPage;