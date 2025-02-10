import React from 'react';

interface ProfilePopoutProps {
    username: string;
    stats: any;
    levels: any;
    badges: any[]; 
}

const ProfilePopout: React.FC<ProfilePopoutProps> = ({ username, stats, levels, badges }) => {
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