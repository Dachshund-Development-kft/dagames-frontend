import axios from 'axios';

export const getShopItems = async (id: string) => {
    const response = await axios.get(`https://api.dagames.online/v1/shop/${id}`);
    return response.data;
};