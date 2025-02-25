import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../../api/socket';
import Loading from '../../components/loading';

const gamePage: React.FC = () => {
    const { id: matchid } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        socket.emit('auth', { token: localStorage.getItem('token') });

        if (matchid === 'undefined') {
            window.location.href = '/play';
        }

        setTimeout(() => {
            const localMatchId = localStorage.getItem('game_id');
            const localToken = localStorage.getItem('game_token');

            console.log('Local match id:', localMatchId);
            console.log('Local token:', localToken);
            if (localMatchId) {
                if (localMatchId === matchid) {
                    socket.emit('game_auth', { token: localToken, id: localMatchId });
                } else {
                    localStorage.removeItem('game_id');
                    localStorage.removeItem('game_token');
                    window.location.href = '/play'
                }
            }

            socket.on('game_auth', (data: any) => {
                if (data.success) {
                    console.log('Game auth success');
                } else {
                    localStorage.removeItem('game_id');
                    localStorage.removeItem('game_token');
                    console.log('Game auth failed');
                    window.location.href = '/play';
                }
            });
        }, 1000);

        setLoading(false);
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <main className='flex flex-col items-center justify-center min-h-screen'>
                <p>sigma</p>
            </main>
        </>
    );
};

export default gamePage;