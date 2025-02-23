import axios from 'axios';

if (!localStorage.getItem('url')) {
  localStorage.setItem('url', 'https://api.dagames.online');
}

export const register = async (username: string, password: string, email: string) => {
  const response = await axios.post(`${localStorage.getItem('url')}/v1/auth/register`, { username, password, email });
  return response.data;
};