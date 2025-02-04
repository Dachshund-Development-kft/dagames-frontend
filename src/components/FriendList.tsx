import React, { useState } from 'react';
import '../assets/FriendList.css';

const friends = [
    { id: 1, name: 'Alice', status: 'Online', avatar: '/Logo.svg' },
    { id: 2, name: 'Bob', status: 'Offline', avatar: '/Logo.svg' },
    { id: 3, name: 'Charlie', status: 'Online', avatar: '/Logo.svg' },
    { id: 4, name: 'David', status: 'Online', avatar: '/Logo.svg' },
    { id: 5, name: 'Emma', status: 'Offline', avatar: '/Logo.svg' },
];

const FriendList: React.FC = () => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`friend-list ${hovered ? 'expanded' : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="header">{hovered ? 'Friends' : '👥'}</div>
            <ul className="list">
                {friends.map(friend => (
                    <li key={friend.id} className="friend">
                        <img src={friend.avatar} alt={friend.name} className="avatar" />
                        {hovered && (
                            <>
                                <span className="name">{friend.name}</span>
                                <span className={`status ${friend.status === 'Online' ? 'online' : 'offline'}`}>
                                    {friend.status}
                                </span>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendList;
