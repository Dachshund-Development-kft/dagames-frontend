import axios from 'axios';

if (!localStorage.getItem('url')) {
    localStorage.setItem('url', 'https://api.dagames.online');
  }

export const lobby = async () => {
    const response = await axios.get(`${localStorage.getItem('url')}/v1/lobby`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return response;
};

export const lobbyId = async (id: string) => {
    const response = await axios.get(`${localStorage.getItem('url')}/v1/lobby/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return response;
};