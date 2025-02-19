import React from 'react';
import NavLayoutGame from '../../components/nav';

const SettingsPage: React.FC = () => {
    return (
        <main className='flex flex-col items-center justify-center min-h-screen'>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center gap-4 text-black'>
                <h1>settings go here</h1>
            </div>
        </main>
    );
};

export default SettingsPage;
