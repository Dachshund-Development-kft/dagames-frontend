import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Player {
    username: string;
    stats: {
        wins: number;
        losses: number;
    };
    levels: {
        current: number;
        xp: number;
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

                setPlayer({
                    username,
                    stats,
                    levels,
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!player) {
        return <div>No player data found.</div>;
    }

    const { username, stats, levels, badges } = player;

    return (
        <div className="absolute top-16 left-4 bg-[#1E1F26] p-4 rounded-lg shadow-lg z-50">
            <h2 className="text-white text-lg font-bold">{username}</h2>
            <div className="mt-2">
                <h3 className="text-white font-semibold">Stats</h3>
                <p className="text-white">Wins: {stats.wins}</p>
                <p className="text-white">Losses: {stats.losses}</p>
            </div>
            <div className="mt-2">
                <h3 className="text-white font-semibold">Levels</h3>
                <p className="text-white">Current Level: {levels.current}</p>
                <p className="text-white">XP: {levels.xp}</p>
            </div>
            <div className="mt-2">
                <h3 className="text-white font-semibold">Badges</h3>
                <div className="flex gap-2">
                    {badges.map((badge, index) => (
                        <img key={index} src={badge.image} alt={badge.name} className="w-8 h-8" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfilePopout;