import axios from 'axios';

if (!localStorage.getItem('url')) {
  localStorage.setItem('url', 'https://api.dagames.online');
}

export const getNews = async () => {
  const response = await axios.get(`${localStorage.getItem('url')}/v1/news`);
  return response.data;
};