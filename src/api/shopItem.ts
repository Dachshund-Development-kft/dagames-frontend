import axios from 'axios';

if (!localStorage.getItem('url')) {
    localStorage.setItem('url', 'https://api.dagames.online');
  }

export const getShopItems = async (id: string) => {
    const response = await axios.get(`${localStorage.getItem('url')}/v1/shop/${id}`);
    return response.data;
};