import axios from 'axios';

export const register = async (username: string, password: string, email: string) => {
  if (localStorage.getItem('admin-token')) {
    const response = await axios.post('https://api.dagames.online/v1/auth/register', {
      headers: {
        "admin-token": `${localStorage.getItem('admin-token')}`
      },
      data: { username, password, email }
    });
    return response.data;
  } else {
    const response = await axios.post('https://api.dagames.online/v1/auth/register', { username, password, email });
    return response.data;
  }
};