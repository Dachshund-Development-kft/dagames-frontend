import axios from 'axios';

export const character = async (id:string) => {
    const response = await axios.post('https://api.dagames.online/v1/user/@me/character', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, data: { itemid: id } });
    return response;
};

export const weapon = async (id:string) => {
    const response = await axios.post('https://api.dagames.online/v1/user/@me/weapon', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, data: { weaponid: id } });
    return response;
};