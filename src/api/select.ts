import axios from 'axios';

if (!localStorage.getItem('url')) {
    localStorage.setItem('url', 'https://api.dagames.online');
  }

export const character = async (id: string) => {
    const response = await axios.post(
        `${localStorage.getItem('url')}/v1/user/@me/character/select`,
        { itemid: id },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    return response;
};

export const weapon = async (id: string) => {
    const response = await axios.post(
        `${localStorage.getItem('url')}/v1/user/@me/weapon/select`,
        { weaponid: id },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    return response;
};