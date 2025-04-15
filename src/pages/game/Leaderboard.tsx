import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavLayoutGame from '../../components/nav';
import Loading from '../../components/loading';
import { motion, AnimatePresence } from 'framer-motion';

interface Player {
    username: string;
    wins: number;
    losses: number;
}

interface Team {
    team: string;
    points: number | null;
    players: Player[];
}

interface LeaderboardEntry {
    team: string;
    points: number;
    players: Player[];
    totalWins: number;
    totalLosses: number;
    winRate: number;
    totalGames: number;
}

const LeaderboardPage: React.FC = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [, setPreviousData] = useState<LeaderboardEntry[]>([]);
    const [sortMode] = useState<'points' | 'winRate' | 'totalWins' | 'totalGames'>('points');
    const [sortDirection] = useState<'asc' | 'desc'>('desc');
    const [loading, setLoading] = useState<boolean>(true);
    const [highlightedTeam, setHighlightedTeam] = useState<string | null>(null);
    const prevDataRef = useRef<LeaderboardEntry[]>([]);

    useEffect(() => {
        fetchLeaderboardData();
        const interval = setInterval(fetchLeaderboardData, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            const response = await axios.get('https://api.dagames.online/v1/leaderboard/teams');
            const teamsData: Team[] = response.data;

            const processedData: LeaderboardEntry[] = teamsData.map(team => {
                const totalWins = team.players.reduce((sum, player) => sum + (player.wins || 0), 0);
                const totalLosses = team.players.reduce((sum, player) => sum + (player.losses || 0), 0);
                const totalGames = totalWins + totalLosses;
                const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

                return {
                    team: team.team,
                    points: team.points || 0,
                    players: team.players,
                    totalWins,
                    totalLosses,
                    winRate,
                    totalGames
                };
            });

            if (prevDataRef.current.length > 0) {
                const changedTeams = findChangedTeams(prevDataRef.current, processedData);
                if (changedTeams.length > 0) {
                    setHighlightedTeam(changedTeams[0]);
                    setTimeout(() => setHighlightedTeam(null), 2000);
                }
            }

            setPreviousData(prevDataRef.current);
            prevDataRef.current = processedData;
            setLeaderboardData(processedData);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch leaderboard data:', error);
            toast.error('Failed to load leaderboard data');
            setLoading(false);
        }
    };

    const findChangedTeams = (oldData: LeaderboardEntry[], newData: LeaderboardEntry[]) => {
        const changedTeams: string[] = [];
        
        newData.forEach(newTeam => {
            const oldTeam = oldData.find(t => t.team === newTeam.team);
            if (!oldTeam) {
                changedTeams.push(newTeam.team);
                return;
            }

            if (oldTeam.points !== newTeam.points || 
                oldTeam.totalWins !== newTeam.totalWins || 
                oldTeam.totalLosses !== newTeam.totalLosses) {
                changedTeams.push(newTeam.team);
            }
        });

        return changedTeams;
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
            <main className="flex flex-grow items-center justify-center py-16 px-4">
                <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-4xl text-center">
                    <h2 className="text-3xl font-bold bg-white bg-clip-text">
                        Team Leaderboard
                    </h2>
                    <div className="mt-10">
                        <div className="overflow-auto max-h-96">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="sticky top-0">
                                        <th className="p-2">Team</th>
                                        <th className="p-2">Points</th>
                                        <th className="p-2">Wins</th>
                                        <th className="p-2">Losses</th>
                                        <th className="p-2">Win Rate</th>
                                        <th className="p-2">Games</th>
                                        <th className="p-2">Players</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {sortedData.map((entry) => (
                                            <motion.tr 
                                                key={entry.team}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ 
                                                    opacity: 1, 
                                                    y: 0,
                                                    backgroundColor: highlightedTeam === entry.team ? 'rgba(59, 130, 246, 0.3)' : 'transparent'
                                                }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="border-b border-gray-700 hover:bg-gray-800"
                                            >
                                                <td className="p-2 font-semibold">{entry.team}</td>
                                                <td className="p-2">{entry.points}</td>
                                                <td className="p-2">{entry.totalWins}</td>
                                                <td className="p-2">{entry.totalLosses}</td>
                                                <td className="p-2">{entry.winRate}%</td>
                                                <td className="p-2">{entry.totalGames}</td>
                                                <td className="p-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {entry.players.map(player => (
                                                            <span key={player.username} className="text-xs bg-gray-700 px-2 py-1 rounded">
                                                                {player.username}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LeaderboardPage;