import axios from 'axios';

if (!localStorage.getItem('url')) {
  localStorage.setItem('url', 'https://api.dagames.online');
}

export const me = async () => {
  const response = await axios.get(`${localStorage.getItem('url')}/v1/user/@me`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return response.data;
};

export const badges = async () => {
  const response = await axios.get(`${localStorage.getItem('url')}/v1/user/@me/badges`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  return response;
}

export const user = async (userId: string) => {
  const response = await axios.get(`${localStorage.getItem('url')}/v1/users/${userId}`, {
    headers:
      { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data.username;
}