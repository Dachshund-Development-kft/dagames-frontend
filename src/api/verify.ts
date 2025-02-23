import axios from 'axios';

if (!localStorage.getItem('url')) {
  localStorage.setItem('url', 'https://api.dagames.online');
}

export const verify = async (code: string) => {
  const response = await axios.post(`${localStorage.getItem('url')}/v1/auth/verify?code=${code}`);
  return response.data;
};