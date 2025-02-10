import { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/navLayoutGame';
import { me } from '../../api/me';
import NewsLayout from '../../components/news';
import SetupLayout from '../../components/setupLayout';

const ProfileModal = ({ user, onClose }: { user: any, onClose: () => void }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1E1F25] p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-300">
                        &times;
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <img src={user.pfp} alt="Profile" className="w-16 h-16 rounded-full" />
                        <div>
                            <p className="text-white">Level: {user.lvl}</p>
                            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: '34%' }} // Fixed at 34%
                                ></div>
                            </div>
                            <p className="text-white">Rank: {user.rank}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Stats</h3>
                        <p className="text-white">Wins: {user.wins}</p>
                        <p className="text-white">Losses: {user.losses}</p>
                        <p className="text-white">Draws: {user.draws}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Badges</h3>
                        {user.badges.length > 0 ? (
                            <div className="flex space-x-2">
                                {user.badges.map((badge: any, index: number) => (
                                    <img
                                        key={index}
                                        src={badge.icon}
                                        alt={badge.name}
                                        className="w-8 h-8"
                                        title={badge.name}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-white">No badges available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PlayPage = () => {
    const [user, setUser] = useState<{ username: string; pfp: string; lvl: number; rank: string; badges: any[]; isNew: boolean } | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showSetupLayout, setShowSetupLayout] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await me();

                try {
                    const badgesResponse = await fetch('https://api.dagames.online/v1/user/@me/badges', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (badgesResponse.ok) {
                        const badgeData = await badgesResponse.json();

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
                } catch (badgeError) {
                    console.error('Error fetching badges:', badgeError);
                    setUser({
                        ...userData,
                        badges: []
                    });
                }
            } catch (err) {
                localStorage.removeItem('token');
                console.error(err);
                window.location.href = '/login';
            }
        };

        fetchData();
    }, []);

    const handleSetupComplete = () => {
        setShowSetupLayout(false);
    };

    return (
        <main className='flex flex-col items-center justify-center min-h-screen bg-[#0F1015]' style={{ backgroundImage: "url(/blobs.svg)" }}>
            <NavLayoutGame />
            <NewsLayout />
            <div className='flex flex-grow items-center justify-center gap-4'>
            </div>

            {user && (
                <div className="fixed top-20 left-4">
                    <div className="border-2 border-[#1E1F25] p-4 rounded-lg bg-[#1E1F25] flex items-center space-x-2 cursor-pointer" onClick={() => setShowProfileModal(true)}>
                        <img src={user.pfp} alt="Profile" className="w-10 h-10 rounded-full" />
                        <div>
                            <span className="text-white font-bold">{user.username}</span>
                            <div className="text-white">
                                <span>Level: {user.lvl}</span>
                                <span className="ml-2">Rank: {user.rank}</span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: '34%' }} // Fixed at 34%
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showProfileModal && <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />}

            {showSetupLayout && <SetupLayout onComplete={handleSetupComplete} />}
        </main>
    );
};

export default PlayPage;