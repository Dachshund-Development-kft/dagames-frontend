import axios from 'axios';

export const getNews = async () => {
  const response = await axios.get('https://api.dagames.online/v1/news');
  return response.data;
};