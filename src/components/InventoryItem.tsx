import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { character, weapon } from '../api/select';

interface InventoryItemProps {
    id: string;
    name: string;
    type: string;
    icon: string;
    isEquipped: boolean;
    onEquip?: () => void;
    stats?: { [key: string]: number };
}

interface ItemStats {
    power?: { from: number; to: number };
    speed?: { from: number; to: number };
    ability?: { from: number; to: number };
    defend?: { from: number; to: number };
    damage?: { from: number; to: number };
    attack?: { from: number; to: number };
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const itemCache: { [key: string]: any } = {};

const calculateRarity = (itemStats: ItemStats, actualStats: { [key: string]: number }): number => {
    let total = 0;
    let count = 0;

    for (const key in itemStats) {
        if (itemStats.hasOwnProperty(key)) {
            const statKey = key as keyof ItemStats;
            const stat = itemStats[statKey];
            const actualValue = actualStats[key];

            if (stat && actualValue !== undefined && stat.from !== stat.to) {
                const progress = (actualValue - stat.from) / (stat.to - stat.from);
                total += progress;
                count++;
            }
        }
    }

    if (count === 0) return 0;

    const averageRarity = total / count;

    const normalizedRarity = averageRarity * 100;

    return normalizedRarity;
};

const getRarityColor = (rarity: number): string => {
    if (rarity < 20) return 'green'; // Common (0-20)
    if (rarity < 40) return 'blue'; // Uncommon (20-40)
    if (rarity < 60) return 'purple'; // Rare (40-60)
    if (rarity < 80) return 'orange'; // Epic (60-80)
    return 'red'; // Legendary (80-100)
};

const InventoryItem: React.FC<InventoryItemProps> = ({ id, name, icon, type, isEquipped, onEquip, stats = {} }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [itemStats, setItemStats] = useState<ItemStats>({});
    const [rarityColor, setRarityColor] = useState<string>('green');

    const debouncedId = useDebounce(id, 500);

    useEffect(() => {
        const fetchItemData = async () => {
            try {
                if (itemCache[debouncedId]) {
                    const itemData = itemCache[debouncedId];
                    console.log('Item data loaded from cache:', itemData);
                    processItemData(itemData);
                    return;
                }

                console.log(itemStats);

                const response = await axios.get(`https://api.dagames.online/v1/shop/${debouncedId}`);
                const itemData = response.data;

                itemCache[debouncedId] = itemData;
                console.log('Item data fetched from API:', itemData);

                processItemData(itemData);
            } catch (error) {
                console.error('Error fetching item data:', error);
                setError('Failed to load item data');
            }
        };

        const processItemData = (itemData: any) => {
            const newItemStats: ItemStats = {};
            if (itemData.stat_power_from !== undefined) {
                newItemStats.power = { from: itemData.stat_power_from, to: itemData.stat_power_to };
            }
            if (itemData.stat_speed_from !== undefined) {
                newItemStats.speed = { from: itemData.stat_speed_from, to: itemData.stat_speed_to };
            }
            if (itemData.stat_ability_from !== undefined) {
                newItemStats.ability = { from: itemData.stat_ability_from, to: itemData.stat_ability_to };
            }
            if (itemData.stat_defense_from !== undefined) {
                newItemStats.defend = { from: itemData.stat_defense_from, to: itemData.stat_defense_to };
            }
            if (itemData.stat_damage_from !== undefined) {
                newItemStats.damage = { from: itemData.stat_damage_from, to: itemData.stat_damage_to };
            }
            if (itemData.stat_attack_from !== undefined) {
                newItemStats.attack = { from: itemData.stat_attack_from, to: itemData.stat_attack_to };
            }

            setItemStats(newItemStats);

            const calculatedRarity = calculateRarity(newItemStats, stats);
            setRarityColor(getRarityColor(calculatedRarity));
        };

        fetchItemData();
    }, [debouncedId, stats]);

    const handleItemClick = () => {
        setIsDialogOpen(true);
    };

    const handleEquip = async () => {
        try {
            let response;

            if (type === 'character') {
                response = await character(id);
            } else if (type === 'weapon') {
                response = await weapon(id);
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
        <div className={`flex h-60 w-48 flex-col items-center p-4 bg-black bg-opacity-30 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 relative ${isEquipped && 'border-4 border-opacity-70 border-white rounded-lg'}`} onClick={!isEquipped ? handleItemClick : undefined}>
            <img src={icon} alt={name} className="w-16 h-16 mb-2" />
            <span className="text-white text-md font-bold">{name}</span>
            <span className="text-gray-400 text-xs">{type}</span>

            <div className="mt-2 text-xs text-gray-300">
                {stats.power && <div>Power: {stats.power}</div>}
                {stats.speed && <div>Speed: {stats.speed}</div>}
                {stats.ability && <div>Ability: {stats.ability}</div>}
                {stats.defend && <div>Defend: {stats.defend}</div>}
                {stats.damage && <div>Damage: {stats.damage}</div>}
                {stats.attack && <div>Attack: {stats.attack}</div>}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-5 w-full rounded-b-lg opacity-50"style={{ background: `linear-gradient(to top, ${rarityColor}, transparent)` }}></div>

            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={handleCloseDialog}>
                    <div className="bg-gray-800 p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-white text-lg text-center font-bold">{name}</h2>
                        {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
                        <button className="mt-5 px-4 py-2 bg-blue-500 text-white rounded m-2" onClick={handleEquip}>Equip</button>
                        <button className="mt-5 ml-2 px-4 py-2 bg-gray-500 text-white rounded m-2" onClick={handleCloseDialog}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryItem;