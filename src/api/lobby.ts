import axios from 'axios';

export const lobby = async () => {
    const response = await axios.get('https://api.dagames.online/v1/lobby', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return response;
};