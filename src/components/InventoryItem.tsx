import React, { useState, useEffect } from 'react';
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
    shopData?: {
        stat_power_to?: number;
        stat_speed_to?: number;
        stat_ability_to?: number;
        stat_defend_to?: number;
        stat_damage_to?: number;
        stat_attack_to?: number;
    };
}

// Helper function to calculate percentage for a stat
const calculateStatPercentage = (from: number, to: number) => {
    if (to === 0) return 0; // Avoid division by zero
    return (from / to) * 100;
};

// Helper function to calculate average percentage for all stats
const calculateAveragePercentage = (stats: InventoryItemProps['stats'], shopData: InventoryItemProps['shopData']) => {
    if (!stats || !shopData) return 0;

    const percentages = [];
    if (stats.power && shopData.stat_power_to) percentages.push(calculateStatPercentage(stats.power, shopData.stat_power_to));
    if (stats.speed && shopData.stat_speed_to) percentages.push(calculateStatPercentage(stats.speed, shopData.stat_speed_to));
    if (stats.ability && shopData.stat_ability_to) percentages.push(calculateStatPercentage(stats.ability, shopData.stat_ability_to));
    if (stats.defend && shopData.stat_defend_to) percentages.push(calculateStatPercentage(stats.defend, shopData.stat_defend_to));
    if (stats.damage && shopData.stat_damage_to) percentages.push(calculateStatPercentage(stats.damage, shopData.stat_damage_to));
    if (stats.attack && shopData.stat_attack_to) percentages.push(calculateStatPercentage(stats.attack, shopData.stat_attack_to));

    if (percentages.length === 0) return 0;

    const average = percentages.reduce((sum, percentage) => sum + percentage, 0) / percentages.length;
    return average;
};

// Helper function to determine rarity
const getRarity = (averagePercentage: number) => {
    if (averagePercentage < 50) return { name: 'Common', color: 'gray' };
    if (averagePercentage < 75) return { name: 'Rare', color: 'blue' };
    if (averagePercentage < 90) return { name: 'Epic', color: 'purple' };
    return { name: 'Legendary', color: 'orange' };
};

// Helper function to generate gradient style
const getGradientStyle = (rarityColor: string) => {
    const defaultColor = '#1E1F25'; // Default background color (gray-800)
    return {
        background: `linear-gradient(135deg, ${defaultColor}, ${rarityColor})`,
    };
};

const InventoryItem: React.FC<InventoryItemProps> = ({ id, name, icon, type, stats = {}, isEquipped, onEquip, shopData }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate average percentage and rarity
    const averagePercentage = calculateAveragePercentage(stats, shopData);
    const rarity = getRarity(averagePercentage);

    // Get gradient style based on rarity
    const gradientStyle = getGradientStyle(
        rarity.color === 'gray' ? '#6B7280' : // gray-500
        rarity.color === 'blue' ? '#3B82F6' : // blue-500
        rarity.color === 'purple' ? '#8B5CF6' : // purple-500
        '#F97316' // orange-500
    );

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
            className="flex h-60 w-48 flex-col items-center p-4 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
            style={gradientStyle} // Apply gradient background
            onClick={!isEquipped ? handleItemClick : undefined}
        >
            <img src={icon} alt={name} className="w-16 h-16 mb-2" />
            <span className="text-white text-sm">{name}</span>
            <span className="text-gray-400 text-xs">{type}</span>
            {/* Display Rarity */}
            <span className={`text-${rarity.color}-500 text-xs`}>{rarity.name}</span>
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