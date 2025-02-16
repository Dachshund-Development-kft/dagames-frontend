import axios from 'axios';

export const me = async () => {
  const response = await axios.get('https://api.dagames.online/v1/user/@me', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return response.data;
};

export const badges = async () => {
  const response = await axios.get('https://api.dagames.online/v1/user/@me/badges', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return response;
}