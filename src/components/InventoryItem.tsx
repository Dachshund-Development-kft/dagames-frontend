import React, { useState } from 'react';
import axios from 'axios';

interface InventoryItemProps {
    id: number;
    name: string;
    type: string;
    icon: string;
    stats: {
        power?: number;
        speed?: number;
        ability?: number;
        defend?: number;
        damage?: number;
        attack?: number;
    };
    isEquipped: boolean;
    onEquip?: () => void;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ id, name, icon, type, stats, isEquipped, onEquip }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleItemClick = () => {
        setIsDialogOpen(true);
    };

    const handleEquip = async () => {
        try {
            let endpoint = '';
            let body = {};

            if (type === 'character') {
                endpoint = '/@me/character/select';
                body = { itemid: id };
            } else if (type === 'weapon') {
                endpoint = '/@me/weapon/select';
                body = { weaponid: id };
            } else {
                console.error('Invalid item type');
                return;
            }

            const response = await axios.put(
                `https://api.dagames.online/v1/user${endpoint}`,
                body,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.success) {
                console.log(`${type} equipped successfully: ${name}`);
                setIsDialogOpen(false);
                if (onEquip) onEquip();
            } else {
                console.error('Failed to equip item:', response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error equipping item:', error.message);
            } else {
                console.error('Error equipping item:', error);
            }
        }
    };

    const handleCloseDialog = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDialogOpen(false);
    };

    return (
        <div className="flex h-60 w-48 flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300" onClick={handleItemClick}>
            <img src={icon} alt={name} className="w-16 h-16 mb-2" />
            <span className="text-white text-sm">{name}</span>
            <span className="text-gray-400 text-xs">{type}</span>
            {isEquipped && <span className="text-green-500 text-xs">Equipped</span>}
            <div className="mt-2 text-xs text-gray-300">
                {stats.power && <div>Power: {stats.power}</div>}
                {stats.speed && <div>Speed: {stats.speed}</div>}
                {stats.ability && <div>Ability: {stats.ability}</div>}
                {stats.defend && <div>Defend: {stats.defend}</div>}
                {stats.damage && <div>Damage: {stats.damage}</div>}
                {stats.attack && <div>Attack: {stats.attack}</div>}
            </div>

            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={handleCloseDialog}>
                    <div className="bg-gray-800 p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-white text-lg">{name}</h2>
                        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleEquip}>Equip</button>
                        <button className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded" onClick={handleCloseDialog}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryItem;