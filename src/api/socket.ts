import io from 'socket.io-client';

if (!localStorage.getItem('url')) {
  localStorage.setItem('url', 'https://api.dagames.online');
}

const socket = io(`${localStorage.getItem('url')}`, {
  reconnection: true,
  reconnectionDelay: 1000,
  transports: ['websocket'],
});

if (localStorage.getItem('token')) {
  socket.emit('auth', { "token": localStorage.getItem('token') });
}

socket.on('connect', () => {
  console.log('Connected to server');
  socket.on('auth', (data: any) => {
    if (data.auth) {
      console.log('Authenticated');
    } else {
      window.location.href = '/';
      console.log('Authentication failed');
    }
  });
});

export default socket;