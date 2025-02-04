import React from 'react';
import NavLayoutGame from '../../components/game/navLayoutGame';
import FriendList from '../../components/game/FriendList';

const LobbyPage: React.FC = () => {
    return (
        <main className='flex flex-col items-center justify-center min-h-screen bg-[#0F1015]' style={{ backgroundImage: "url(/blobs.svg)" }}>
            <NavLayoutGame />
            <FriendList />
            <div className='flex flex-grow items-center justify-center gap-4'>
                <h1 className='text-3xl font-bold text-white bg-clip-text bg-gradient-to-r from-[#FF0080] to-[#7928CA]'>
                    Lobby
                </h1>
                <div className='flex flex-col items-center justify-center gap-4'>
                <button className='bg-[#FF0080] text-white px-5 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                        Play matchmaking
                    </button>
                    <button className='bg-[#FF0080] text-white px-5 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                        Create room
                    </button>
                    <button className='bg-[#FF0080] text-white px-5 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                        Join room
                    </button>
                </div>
            </div>
        </main>
    );
};

export default LobbyPage;
