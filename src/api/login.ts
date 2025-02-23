import axios from 'axios';

if (!localStorage.getItem('url')) {
  localStorage.setItem('url', 'https://api.dagames.online');
}

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${localStorage.getItem('url')}/v1/auth/login`, { username, password });
  return response.data;
};