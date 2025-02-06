import React, { useEffect } from 'react';
import NavLayoutGame from '../../components/navLayoutGame';
import { me } from '../../api/me';
import NewsLayout from '../../components/news';

const MainPage: React.FC = () => {

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await me();
                console.log(response.username);
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
            <NewsLayout />
            <div className='flex flex-grow items-center justify-center gap-4'>

            </div>
        </main>
    );
};

export default MainPage;
