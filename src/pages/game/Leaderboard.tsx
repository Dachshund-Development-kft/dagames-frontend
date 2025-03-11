import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavLayoutGame from '../../components/nav';
import Loading from '../../components/loading';

interface LeaderboardEntry {
    username: string;
    wins: number;
    played: number;
    coins: number;
    level: number;
    rank: number;
}

const LeaderboardPage: React.FC = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [sortMode, setSortMode] = useState<'wins' | 'played' | 'coins' | 'level' | 'rank'>('wins');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            // Fetch data for all modes
            const [winsResponse, playedResponse, coinsResponse, levelResponse, rankResponse] = await Promise.all([
                axios.get('https://api.dagames.online/v1/leaderboard?mode=wins'),
                axios.get('https://api.dagames.online/v1/leaderboard?mode=played'),
                axios.get('https://api.dagames.online/v1/leaderboard?mode=coins'),
                axios.get('https://api.dagames.online/v1/leaderboard?mode=level'),
                axios.get('https://api.dagames.online/v1/leaderboard?mode=rank'),
            ]);

            // Combine all data into a single array
            const combinedData: LeaderboardEntry[] = winsResponse.data.map((entry: any) => ({
                username: entry.username,
                wins: entry.wins || 0,
                played: playedResponse.data.find((e: any) => e.username === entry.username)?.played || 0,
                coins: coinsResponse.data.find((e: any) => e.username === entry.username)?.coins || 0,
                level: levelResponse.data.find((e: any) => e.username === entry.username)?.level || 0,
                rank: rankResponse.data.find((e: any) => e.username === entry.username)?.rank || 0,
            }));

            setLeaderboardData(combinedData);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch leaderboard data:', error);
            toast.error('Failed to load leaderboard data');
        }
    };

    const handleSort = (mode: 'wins' | 'played' | 'coins' | 'level' | 'rank') => {
        if (mode === sortMode) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortMode(mode);
            setSortDirection('desc');
        }
    };

    const sortedData = [...leaderboardData].sort((a, b) => {
        const aValue = a[sortMode] || 0;
        const bValue = b[sortMode] || 0;

        if (sortDirection === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col min-h-screen text-white bg-cover bg-repeat-y">
            <NavLayoutGame />
            <main className="flex flex-grow items-center justify-center py-16">
                <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-4xl text-center">
                    <h2 className="text-3xl font-bold bg-white bg-clip-text">
                        Leaderboard
                    </h2>
                    <div className="mt-10">
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => handleSort('wins')}
                                className={`px-4 py-2 rounded-lg ${sortMode === 'wins' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-opacity-90 transition-all duration-300`}
                            >
                                Wins {sortMode === 'wins' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </button>
                            <button
                                onClick={() => handleSort('played')}
                                className={`px-4 py-2 rounded-lg ${sortMode === 'played' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-opacity-90 transition-all duration-300`}
                            >
                                Played {sortMode === 'played' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </button>
                            <button
                                onClick={() => handleSort('coins')}
                                className={`px-4 py-2 rounded-lg ${sortMode === 'coins' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-opacity-90 transition-all duration-300`}
                            >
                                Coins {sortMode === 'coins' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </button>
                            <button
                                onClick={() => handleSort('level')}
                                className={`px-4 py-2 rounded-lg ${sortMode === 'level' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-opacity-90 transition-all duration-300`}
                            >
                                Level {sortMode === 'level' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </button>
                            <button
                                onClick={() => handleSort('rank')}
                                className={`px-4 py-2 rounded-lg ${sortMode === 'rank' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-opacity-90 transition-all duration-300`}
                            >
                                Rank {sortMode === 'rank' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="p-2">Username</th>
                                    <th className="p-2">Wins</th>
                                    <th className="p-2">Played</th>
                                    <th className="p-2">Coins</th>
                                    <th className="p-2">Level</th>
                                    <th className="p-2">Rank</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((entry, index) => (
                                    <tr key={index} className="border-b border-gray-700">
                                        <td className="p-2">{entry.username}</td>
                                        <td className="p-2">{entry.wins}</td>
                                        <td className="p-2">{entry.played}</td>
                                        <td className="p-2">{entry.coins}</td>
                                        <td className="p-2">{entry.level}</td>
                                        <td className="p-2">{entry.rank}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
};

export default LeaderboardPage;