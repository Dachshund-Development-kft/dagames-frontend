export interface ShopItem {
    stat_agility_from: number;
    _id: string;
    id: string;
    name: string;
    description: string;
    price: number;
    type: string;
    image: string;
    created_at: string;
    __v: number;
    stat_speed_from?: number;
    stat_speed_to?: number;   
    stat_power_from?: number; 
    stat_power_to?: number;   
    stat_defense_from?: number; 
    stat_defense_to?: number;   
    stat_damage_from?: number;  
    stat_damage_to?: number;    
    stat_attack_from?: number;  
    stat_attack_to?: number;    
}

if (!localStorage.getItem('url')) {
    localStorage.setItem('url', 'https://api.dagames.online');
}

const API_BASE_URL = localStorage.getItem('url');

export const fetchShopItems = async (): Promise<ShopItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/v1/shop`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ShopItem[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shop items:', error);
        throw error;
    }
};

export const fetchShopItemById = async (itemId: string): Promise<ShopItem> => {
    try {
        const response = await fetch(`${API_BASE_URL}/v1/shop/${itemId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ShopItem = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching shop item with ID ${itemId}:`, error);
        throw error;
    }
};

export const buyItem = async (itemId: string): Promise<{ success: boolean; message?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/v1/user/@me/inventory/buy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ itemid: itemId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to buy item');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error buying item:', error);
        throw error;
    }
};