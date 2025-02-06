import axios from 'axios';

export const register = async (username: string, password: string, email: string) => {
  const response = await axios.post('https://api.dagames.online/v1/auth/register', { username, password, email });
  return response.data;
};