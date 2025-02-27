import React, { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/nav';
import { me } from '../../api/me';
import InventoryItem from '../../components/InventoryItem';
import { inventory } from '../../api/inventory';
import Loading from '../../components/loading';

interface InventoryItemProps {
    id: number;
    name: string;
    type: string;
    icon: string;
    equipped: boolean;
    stats: {
        power?: number;
        speed?: number;
        ability?: number;
        defend?: number;
        damage?: number;
        attack?: number;
    };
}

const InventoryPage: React.FC = () => {
    const [inventoryData, setInventoryData] = useState<InventoryItemProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchInventoryData = async () => {
        try {
            const inventoryResponse = await inventory();
            setInventoryData(inventoryResponse);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await me();
                await fetchInventoryData();
                console.log(response.character, response.weapon);
            } catch (err) {
                localStorage.removeItem('token');
                console.error(err);
                window.location.href = '/login';
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const sortedInventoryData = [...inventoryData].sort((a, b) => {
        if (a.equipped && !b.equipped) return -1;
        if (!a.equipped && b.equipped) return 1;
        return 0;
    });

    if (loading) return <Loading />;

    return (
        <main className='flex flex-col items-center justify-center min-h-screen overflow-hidden'>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center w-full max-w-[1400px] p-4'>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-4 w-full h-[calc(100vh-200px)] overflow-y-auto p-4 scrollbar-hide">
                    {sortedInventoryData.map(item => (
                        <InventoryItem
                            key={item.id}
                            id={item.id.toString()}
                            name={item.name}
                            icon={item.icon}
                            type={item.type}
                            isEquipped={item.equipped}
                            stats={item.stats}
                            onEquip={fetchInventoryData}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default InventoryPage;