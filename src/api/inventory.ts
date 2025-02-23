import axios from 'axios';

if (!localStorage.getItem('url')) {
  localStorage.setItem('url', 'https://api.dagames.online');
}

export const inventory = async () => {
  const response = await axios.get(`${localStorage.getItem('url')}/v1/user/@me/inventory`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return response.data;
};

