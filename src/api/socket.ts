import io from 'socket.io-client';

const socket = io('https://api.dagames.online', 
{
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ['websocket'],
});

export default socket;