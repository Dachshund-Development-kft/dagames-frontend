import React, { useState, useEffect } from 'react';
import { getNews } from '../api/news';
import socket from '../api/socket';

interface ApiResponse {
    maintenance: boolean;
    message: string | null;
    news: {
        tag_name: string;
        name: string;
        body: string;
        published_at: string;
        author: {
            name: string;
            avatar: string;
        };
    };
}

const AlertLayout: React.FC = () => {
    const [maintenanceMessage, setMaintenanceMessage] = useState<string | null>(null);
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: ApiResponse = await getNews();
                if (response.maintenance) {
                    setMaintenanceMessage(response.message);
                }
            } catch (err) {
                console.error(err);
                setMaintenanceMessage('API is currently down for maintenance.');
            }
        };

        const connectSocket = () => {
            socket.on('connect', () => {
                setSocketConnected(true);

                socket.on('auth', (data) => {
                    if (data.success) {
                        console.log('Socket authenticated');
                        setSocketConnected(true);
                    }
                });
            });
        };

        connectSocket();
        fetchData();
    }, []);

    return (
        <>
            {maintenanceMessage && (
                <div className="fixed top-0 left-0 w-full bg-yellow-500 bg-opacity-30 backdrop-blur-md text-black p-4 text-center z-50">
                    {maintenanceMessage}
                </div>
            )}

            {!socketConnected && (
                <div className="fixed top-0 left-0 w-full bg-blue-900 bg-opacity-30 backdrop-blur-md text-black p-4 text-center z-50">
                    Connection to server lost. Please refresh the page.
                </div>
            )}
        </>
    );
};

export default AlertLayout;