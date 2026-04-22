import io from 'socket.io-client';

if (!localStorage.getItem('url')) {
  localStorage.setItem('url', 'https://api.dagames.online');
}

const socket = io(`${localStorage.getItem('url')}`, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  transports: ['websocket', 'polling'],
  autoConnect: true,
});

const getToken = (): string | null => localStorage.getItem('token');

const syncSocketAuthPayload = (): void => {
  const token = getToken();
  socket.auth = token ? { token } : {};
};

export const ensureSocketConnectedAndAuthenticated = (): void => {
  syncSocketAuthPayload();

  if (!socket.connected) {
    socket.connect();
  }

  const token = getToken();
  if (token) {
    socket.emit('auth', { token });
  }
};

syncSocketAuthPayload();

socket.io.on('reconnect_attempt', () => {
  syncSocketAuthPayload();
});

socket.on('connect', () => {
  const token = getToken();
  if (token) {
    socket.emit('auth', { token });
  }
});

export default socket;
