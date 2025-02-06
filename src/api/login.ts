import axios from 'axios';

export const login = async (username: string, password: string) => {
  const response = await axios.post('https://api.dagames.online/v1/auth/login', { username, password });
  return response.data;
};