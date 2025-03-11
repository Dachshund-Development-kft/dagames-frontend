import { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/nav';
import { me, badges } from '../../api/me';
import { matches } from '../../api/matches';
import NewsLayout from '../../components/news';
import SetupLayout from '../../components/setupLayout';
import AlertLayout from '../../components/alert';
import Loading from '../../components/loading';
import MatchPopup from '../../components/matchPopup';
import ProfilePopout from '../../components/ProfilePopout';

const PlayPage = () => {
    const [user, setUser] = useState<{ username: string; pfp: string; lvl: number; rank: string; badges: any[]; isNew: boolean, xp: number, xpNeeded: number, id: string } | null>(null);
    const [showSetupLayout, setShowSetupLayout] = useState(false);
    const [loading, setLoading] = useState(true);
    const [matchPopup, setMatchPopup] = useState(false);
    const [matchData, setMatchData] = useState<any>(null);
    const [showProfilePopout, setShowProfilePopout] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
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

                        if (userData.isNew) {
                            setShowSetupLayout(true);
                        }
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
                setMatchData(response);
                setMatchPopup(true);
            } catch (err) {
                console.error('Error fetching match data:', err);
            }
        };

        handleid();
        fetchData();
    }, []);

    const handleSetupComplete = () => {
        setShowSetupLayout(false);
    };

    const handleCloseMatchPopup = () => {
        setMatchPopup(false);
        window.location.href = '/';
    };

    const toggleProfilePopout = () => {
        setShowProfilePopout(!showProfilePopout);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <main className='flex flex-col items-center justify-center min-h-screen'>
            <NavLayoutGame />
            <NewsLayout />
            <AlertLayout />
            <div className='flex flex-grow items-center justify-center gap-4'>
            </div>

            {user && (
                <div className="fixed top-20 left-4">
                    <div className="bg-black bg-opacity-50 backdrop-blur-md p-4 rounded-lg flex items-center space-x-2 cursor-pointer" onClick={toggleProfilePopout}>
                        <img src={user.pfp} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                        <div>
                            <span className="text-white font-bold">{user.username}</span>
                            <div className="text-white">
                                <span>Level: {user.lvl}</span>
                                <span className="ml-2">Rank: {user.rank}</span>
                                {user.badges.length > 0 ? (
                                    <div className="flex space-x-2">
                                        {user.badges.map((badge: any, index: number) => (
                                            <img key={index} src={badge.icon} alt={badge.name} className="w-8 h-8" title={badge.name} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white">No badges available.</p>
                                )}
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((user.xp / user.xpNeeded) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showProfilePopout && user && (
                <>
                    <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={toggleProfilePopout} />
                    <ProfilePopout playerId={user.id} />
                </>
            )}

            {showSetupLayout && <SetupLayout onComplete={handleSetupComplete} />}
            {matchPopup && <MatchPopup matchData={matchData} onClose={handleCloseMatchPopup} />}
        </main>
    );
};

export default PlayPage;