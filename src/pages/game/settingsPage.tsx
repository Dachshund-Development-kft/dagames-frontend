import React, { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/navLayoutGame';
import { me } from '../../api/me';

const SettingsPage: React.FC = () => {
    const [user, setUser] = useState<any>(null);

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
            <div className='flex flex-grow items-center justify-center gap-4'>
                <h1>settings go here</h1>
            </div>
        </main>
    );
};

export default SettingsPage;
