import React, { useEffect } from 'react';
import NavLayoutGame from '../../components/navLayoutGame';
import { me } from '../../api/me';
import NewsPageLayout from '../../components/newspage';


const InventoryPage: React.FC = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await me();
                console.log(response.username);
            } catch (err) {
                localStorage.removeItem('token');
                console.error(err);
                window.location.href = '/login';
            }
        };

        fetchData();
    }, []);

    return (
        <main className='flex flex-col items-center justify-center min-h-screen bg-[#0F1015]' style={{ backgroundImage: "url(/blobs.svg)" }}>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center gap-4'>
                <NewsPageLayout />
            </div>
        </main>
    );
};

export default InventoryPage;
