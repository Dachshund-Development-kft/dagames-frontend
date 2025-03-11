import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Player {
    username: string;
    rank: string;
    lastPlayed: string;
    pfp: string;
    levels: {
        current: number;
        xp: number;
        xpNeeded: number;
    };
    badges: {
        image: string;
        name: string;
    }[];
}

interface ProfilePopoutProps {
    playerId: string;
}

const ProfilePopout: React.FC<ProfilePopoutProps> = ({ playerId }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const userResponse = await axios.get(`${localStorage.getItem('url')}/v1/users/${playerId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });

                const username = userResponse.data.username;

                const badgeData = userResponse.data.badges;
                console.log(userResponse);
                setPlayer({
                    username: username,
                    rank: userResponse.data.rank,
                    pfp: userResponse.data.pfp,
                    levels: {
                        current: userResponse.data.lvl,
                        xp: userResponse.data.xp,
                        xpNeeded: userResponse.data.xpNeeded,
                    },
                    lastPlayed: userResponse.data.lastPlayed,
                    badges: badgeData,
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching player data:', err);
                setError('Failed to load player data');
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [playerId]);

    if (loading) {
        return;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!player) {
        return <div>No player data found.</div>;
    }

    // 2025-03-10T22:03:21.805Z -> 1d and 2h ago
    const dateThing = (date: string) => {
        const currentDate = new Date();
        const lastPlayed = new Date(date);
        const diff = currentDate.getTime() - lastPlayed.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        return `${days}d and ${hours}h ago`;
    }

    const { username, levels, rank, lastPlayed, pfp } = player;
    const LastPlay = dateThing(lastPlayed);

    return (
        <div className="absolute bg-black bg-opacity-50 p-4 rounded-lg shadow-lg z-50 backdrop-blur-md">
            <h2 className="text-white text-lg font-bold">{username}</h2>
            <img src={pfp} alt={username} className="w-16 h-16 rounded-full" />
            <div className="mt-2">
                <h3 className="text-white font-semibold">Levels</h3>
                <p className="text-white">Current Level: {levels.current}</p>
                <p className="text-white">XP: {levels.xp}</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((levels.xp / levels.xpNeeded) * 100, 100)}%` }}></div>
                </div>
                <p className='text-white'>Rank: {rank}</p>
                <p className='text-white'>Last Played: {LastPlay}</p>
            </div>
        </div>
    );
};

export default ProfilePopout;