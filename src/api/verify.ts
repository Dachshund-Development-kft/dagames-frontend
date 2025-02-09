import axios from 'axios';

export const verify = async (code: string) => {
  const response = await axios.post(`https://api.dagames.online/v1/auth/verify?code=${code}`);
  return response.data;
};