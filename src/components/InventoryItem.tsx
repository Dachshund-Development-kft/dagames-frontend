import React from 'react';

interface InventoryItemProps {
    name: string;
    imageUrl: string;
    quantity: number;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ name, imageUrl, quantity }) => {
    return (
        <div className="flex h-32 w-32 flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300">
            <img src={imageUrl} alt={name} className="w-16 h-16 mb-2" />
            <span className="text-white text-sm">{name}</span>
            <span className="text-gray-400 text-xs">x{quantity}</span>
        </div>
    );
};

export default InventoryItem;