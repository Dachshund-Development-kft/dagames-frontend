import axios from 'axios';

export const login = async (username: string, password: string) => {
  if (localStorage.getItem('admin-token')) {
    const response = await axios.post('https://api.dagames.online/v1/auth/login', {
      headers: {
        "admin-token": `${localStorage.getItem('admin-token')}`
      },
      data: { username, password }
    });
    return response.data;
  } else {
    const response = await axios.post('https://api.dagames.online/v1/auth/login', { username, password });
    return response.data;
  }
};