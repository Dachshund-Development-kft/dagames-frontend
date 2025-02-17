import axios from 'axios';

export const setup = async (weaponid: string, characterid: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token provided');
    }

    const response = await axios.post(
        `https://api.dagames.online/v1/user/@me/setup`,
        { weaponItemid: weaponid, characterItemid: characterid },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response;
};