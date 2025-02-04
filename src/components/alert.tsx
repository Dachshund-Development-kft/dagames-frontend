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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: ApiResponse = await getNews();
                if (response.maintenance) {
                    setMaintenanceMessage(response.message);
                }
            } catch (err) {
                setError('Hiba történt az adatok betöltése közben.');
                console.error(err);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <>
            {maintenanceMessage && (
                <div className="bg-yellow-500 text-black p-4 text-center">
                    {maintenanceMessage}
                </div>
            )}
        </>
    );
};

export default AlertLayout;