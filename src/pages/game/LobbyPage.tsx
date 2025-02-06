import React, { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/navLayoutGame';
import FriendList from '../../components/FriendList';
import { me } from '../../api/me';
import NewsLayout from '../../components/news';

const LobbyPage: React.FC = () => {
    const [setUser] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await me();
                setUser(response);
            } catch (err) {
                console.error(err);
                localStorage.removeItem('token');
                window.location.href = '/';
            }
        };

        fetchData();
    }, []);

    return (
        <main className='flex flex-col items-center justify-center min-h-screen bg-[#0F1015]' style={{ backgroundImage: "url(/blobs.svg)" }}>
            <NavLayoutGame />
            <FriendList />
            <NewsLayout />
            <div className='flex flex-grow items-center justify-center gap-4'>
                <h1 className='text-3xl font-bold text-white bg-clip-text'>
                    Lobby
                </h1>
                <div className='flex flex-col items-center justify-center gap-4'>
                    <button className='bg-[#1a5f31] text-white px-5 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                        Play matchmaking
                    </button>
                    <button className='bg-[#1a235f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                        Create room
                    </button>
                    <button className='bg-[#1a235f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                        Join room
                    </button>
                </div>
            </div>
        </main>
    );
};

export default LobbyPage;
