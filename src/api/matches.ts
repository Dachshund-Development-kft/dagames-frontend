import axios from 'axios';

if (!localStorage.getItem('url')) {
  localStorage.setItem('url', 'https://api.dagames.online');
}

export const matches = async (id: string) => {
  const response = await axios.get(`${localStorage.getItem('url')}/v1/user/@me/match/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return response.data;
};

