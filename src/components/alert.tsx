import React, { useState, useEffect } from 'react';
import { getNews } from '../api/news';

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

        fetchData();
    }, []);

    return (
        <>
            {maintenanceMessage && (
                <div className="fixed top-0 left-0 w-full bg-yellow-500 bg-opacity-30 backdrop-blur-md text-black p-4 text-center z-50">
                    {maintenanceMessage}
                </div>
            )}
        </>
    );
};

export default AlertLayout;