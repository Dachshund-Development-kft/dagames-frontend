import React, { useEffect } from 'react';
import NavLayoutGame from '../../components/nav';
import { me } from '../../api/me';

const SettingsPage: React.FC = () => {
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
        <main className='flex flex-col items-center justify-center min-h-screen'>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center gap-4 text-white'>
                <h1>settings go here</h1>
            </div>
        </main>
    );
};

export default SettingsPage;
