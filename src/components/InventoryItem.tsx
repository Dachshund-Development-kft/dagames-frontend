import React from 'react';

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
}

const InventoryItem: React.FC<InventoryItemProps> = ({ name, icon, type, stats, isEquipped }) => {
    return (
        <div className="flex h-60 w-48 flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300">
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
        </div>
    );
};

export default InventoryItem;