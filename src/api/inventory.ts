import axios from 'axios';

export const inventory = async () => {
  const response = await axios.get('https://api.dagames.online/v1/user/@me/inventory', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return response.data;
};