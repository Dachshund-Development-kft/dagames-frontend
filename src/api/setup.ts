import axios from 'axios';

export const setup = async (weaponid: string, characterid: string) => {
    const response = await axios.get(`https://api.dagames.online/v1/user/@me/setup`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, data: { weaponItemid: weaponid, characterItemid: characterid } });
    return response;
};