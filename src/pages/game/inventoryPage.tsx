import React, { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/navLayoutGame';
import { me } from '../../api/me';
import InventoryItem from '../../components/InventoryItem'; // Adjust the import path as needed

const InventoryPage: React.FC = () => {
    const [inventory, setInventory] = useState([
        { id: 1, name: 'Sword', imageUrl: '/sword.png', quantity: 1 },
        { id: 2, name: 'Shield', imageUrl: '/shield.png', quantity: 2 },
        { id: 3, name: 'Potion', imageUrl: '/potion.png', quantity: 5 },
        { id: 4, name: 'Bow', imageUrl: '/bow.png', quantity: 1 },
        { id: 5, name: 'Arrow', imageUrl: '/arrow.png', quantity: 20 },
        { id: 6, name: 'Helmet', imageUrl: '/helmet.png', quantity: 1 },
        { id: 7, name: 'Armor', imageUrl: '/armor.png', quantity: 1 },
        { id: 8, name: 'Boots', imageUrl: '/boots.png', quantity: 1 },
        { id: 9, name: 'Ring', imageUrl: '/ring.png', quantity: 2 },
        { id: 10, name: 'Necklace', imageUrl: '/necklace.png', quantity: 1 },
        { id: 1, name: 'Sword', imageUrl: '/sword.png', quantity: 1 },
        { id: 2, name: 'Shield', imageUrl: '/shield.png', quantity: 2 },
        { id: 3, name: 'Potion', imageUrl: '/potion.png', quantity: 5 },
        { id: 4, name: 'Bow', imageUrl: '/bow.png', quantity: 1 },
        { id: 5, name: 'Arrow', imageUrl: '/arrow.png', quantity: 20 },
        { id: 6, name: 'Helmet', imageUrl: '/helmet.png', quantity: 1 },
        { id: 7, name: 'Armor', imageUrl: '/armor.png', quantity: 1 },
        { id: 8, name: 'Boots', imageUrl: '/boots.png', quantity: 1 },
        { id: 9, name: 'Ring', imageUrl: '/ring.png', quantity: 2 },
        { id: 10, name: 'Necklace', imageUrl: '/necklace.png', quantity: 1 },
        { id: 1, name: 'Sword', imageUrl: '/sword.png', quantity: 1 },
        { id: 2, name: 'Shield', imageUrl: '/shield.png', quantity: 2 },
        { id: 3, name: 'Potion', imageUrl: '/potion.png', quantity: 5 },
        { id: 4, name: 'Bow', imageUrl: '/bow.png', quantity: 1 },
        { id: 5, name: 'Arrow', imageUrl: '/arrow.png', quantity: 20 },
        { id: 6, name: 'Helmet', imageUrl: '/helmet.png', quantity: 1 },
        { id: 7, name: 'Armor', imageUrl: '/armor.png', quantity: 1 },
        { id: 8, name: 'Boots', imageUrl: '/boots.png', quantity: 1 },
        { id: 9, name: 'Ring', imageUrl: '/ring.png', quantity: 2 },
        { id: 10, name: 'Necklace', imageUrl: '/necklace.png', quantity: 1 },
        { id: 1, name: 'Sword', imageUrl: '/sword.png', quantity: 1 },
        { id: 2, name: 'Shield', imageUrl: '/shield.png', quantity: 2 },
        { id: 3, name: 'Potion', imageUrl: '/potion.png', quantity: 5 },
        { id: 4, name: 'Bow', imageUrl: '/bow.png', quantity: 1 },
        { id: 5, name: 'Arrow', imageUrl: '/arrow.png', quantity: 20 },
        { id: 6, name: 'Helmet', imageUrl: '/helmet.png', quantity: 1 },
        { id: 7, name: 'Armor', imageUrl: '/armor.png', quantity: 1 },
        { id: 8, name: 'Boots', imageUrl: '/boots.png', quantity: 1 },
        { id: 9, name: 'Ring', imageUrl: '/ring.png', quantity: 2 },
        { id: 10, name: 'Necklace', imageUrl: '/necklace.png', quantity: 1 },
        { id: 1, name: 'Sword', imageUrl: '/sword.png', quantity: 1 },
        { id: 2, name: 'Shield', imageUrl: '/shield.png', quantity: 2 },
        { id: 3, name: 'Potion', imageUrl: '/potion.png', quantity: 5 },
        { id: 4, name: 'Bow', imageUrl: '/bow.png', quantity: 1 },
        { id: 5, name: 'Arrow', imageUrl: '/arrow.png', quantity: 20 },
        { id: 6, name: 'Helmet', imageUrl: '/helmet.png', quantity: 1 },
        { id: 7, name: 'Armor', imageUrl: '/armor.png', quantity: 1 },
        { id: 8, name: 'Boots', imageUrl: '/boots.png', quantity: 1 },
        { id: 9, name: 'Ring', imageUrl: '/ring.png', quantity: 2 },
        { id: 10, name: 'Necklace', imageUrl: '/necklace.png', quantity: 1 },
        // Add more items as needed
    ]);

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
            <div className='flex flex-grow items-center justify-center w-full max-w-4xl p-4'>
                <div className="grid grid-cols-6 gap-4 w-full h-[800px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                    {inventory.map(item => (
                        <InventoryItem
                            key={item.id}
                            name={item.name}
                            imageUrl={item.imageUrl}
                            quantity={item.quantity}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default InventoryPage;