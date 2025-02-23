import io from 'socket.io-client';

if (!localStorage.getItem('url')) {
    localStorage.setItem('url', 'https://api.dagames.online');
  }

const socket = io(`${localStorage.getItem('url')}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket'],
});

export default socket;