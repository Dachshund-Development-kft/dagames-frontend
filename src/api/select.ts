import axios from 'axios';

export const character = async (id: string) => {
    const response = await axios.put(
        'https://api.dagames.online/v1/user/@me/character',
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
    const response = await axios.put(
        'https://api.dagames.online/v1/user/@me/weapon',
        { weaponid: id },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    return response;
};