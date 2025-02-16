import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lobby } from '../api/lobby';

interface Lobby {
  id: string;
  name: string;
  public: boolean;
  owner: string;
  players: number; 
}

const LobbyLayout = () => {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchLobbies = async () => {
      const token = localStorage.getItem('token'); 

      if (!token) {
        setError('No token found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await lobby();
        setLobbies(response.data); 
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false); 
      }
    };

    fetchLobbies();
  }, []);

  const handleJoinLobby = (lobbyId: string) => {
    navigate(`/play/lobby/${lobbyId}`); 
  };

  if (loading) {
    return (
      <div className="fixed left-0 top-20 ml-4 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Active Lobbies</h2>
        <div className="text-center text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed left-0 top-20 ml-4 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Active Lobbies</h2>
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-16 p-4 bg-black bg-opacity-40 shadow-2xl rounded-lg">
      <h2 className="text-xl font-bold mb-4">Active Lobbies</h2>
      <ul>
        {lobbies.map((lobby) => (
          <li key={lobby.id} className="mb-3 p-3 bg-white bg-opacity-10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">{lobby.name}</span>
              <span className={`text-sm ${lobby.public ? 'text-green-500' : 'text-red-500'}`}>
                {lobby.public ? 'Public' : 'Private'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Owner: {lobby.owner}
            </div>
            <div className="text-sm text-gray-600">
              Players: {lobby.players}/2
            </div>
            <button
              onClick={() => handleJoinLobby(lobby.id)}
              className="mt-2 w-full bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Join Lobby
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LobbyLayout;