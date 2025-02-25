const MatchPopup = ({ matchData, onClose }: { matchData: any, onClose: any }) => {
    if (!matchData) return null;

    const { players, winner, loser, rank, avarageRank, message } = matchData;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 backdrop-blur-md p-6 rounded-lg max-w-md w-full text-white">
                <h2 className="text-2xl font-bold mb-4">Match Result</h2>
                <p className="text-lg mb-4">{message}</p>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Players</h3>
                    {players.map((player: any, index: number) => (
                        <div key={index} className="mb-2">
                            <p><strong>Character:</strong> {player.character.name}</p>
                            <p><strong>Health:</strong> {player.health}</p>
                            <p><strong>Weapon:</strong> {player.weapon.name}</p>
                        </div>
                    ))}
                </div>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Result</h3>
                    <p><strong>Winner:</strong> {winner}</p>
                    <p><strong>Loser:</strong> {loser}</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Rank</h3>
                    <p><strong>Your Rank:</strong> {rank}</p>
                    <p><strong>Average Rank:</strong> {avarageRank}</p>
                </div>
                <button
                    onClick={onClose}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default MatchPopup;