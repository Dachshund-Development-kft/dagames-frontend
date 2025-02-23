import axios from 'axios';

if (!localStorage.getItem('url')) {
    localStorage.setItem('url', 'https://api.dagames.online');
}

export const setup = async (weaponid: string, characterid: string) => {
    const response = await axios.post(
        `${localStorage.getItem('url')}/v1/user/@me/setup`,
        { weaponItemid: weaponid, characterItemid: characterid },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
    );
    return response;
};