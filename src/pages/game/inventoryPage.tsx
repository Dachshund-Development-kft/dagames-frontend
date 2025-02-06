import React, { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/navLayoutGame';
import { me } from '../../api/me';
import InventoryItem from '../../components/InventoryItem';
import { inventory } from '../../api/inventory';

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await me();
                const inventoryResponse = await inventory();
                setInventoryData(inventoryResponse);
                console.log(response.character, response.weapon);
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
            <div className='flex flex-grow items-center justify-center w-full max-w-[1400px] p-4'>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 w-full gap-4 w-full h-[800px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                    {inventoryData.map(item => (
                        <InventoryItem
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            icon={item.icon}
                            type={item.type}
                            stats={item.stats}
                            isEquipped={item.equipped}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default InventoryPage;