import React, { useState } from 'react';
import axios from 'axios';
import { character, weapon } from '../api/select';

interface InventoryItemProps {
    id: number;
    name: string;
    type: string;
    icon: string;
    stats?: {
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

const InventoryItem: React.FC<InventoryItemProps> = ({ id, name, icon, type, stats = {}, isEquipped, onEquip }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleItemClick = () => {
        setIsDialogOpen(true);
    };

    const handleEquip = async () => {
        try {
            let response;

            if (type === 'character') {
                response = await character(id.toString());
            } else if (type === 'weapon') {
                response = await weapon(id.toString());
            } else {
                console.error('Invalid item type');
                return;
            }

            if (response.data.success) {
                console.log(`${type} equipped successfully: ${name}`);
                setIsDialogOpen(false);
                if (onEquip) onEquip();
            } else {
                setError(response.data.message || 'Failed to equip item');
                console.error('Failed to equip item:', response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || error.message);
                console.error('Error equipping item:', error.message);
            } else {
                setError('An unexpected error occurred');
                console.error('Error equipping item:', error);
            }
        }
    };

    const handleCloseDialog = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDialogOpen(false);
        setError(null);
    };

    return (
        <div
            className="flex h-60 w-48 flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300" onClick={!isEquipped ? handleItemClick : undefined}>
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
                        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleEquip}>Equip</button>
                        <button className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded" onClick={handleCloseDialog}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryItem;