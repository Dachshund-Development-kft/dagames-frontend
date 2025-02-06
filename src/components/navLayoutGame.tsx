import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMiniHome } from "react-icons/hi2";
import { IoSettingsSharp } from "react-icons/io5";
import { FaNewspaper, FaShop } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { MdInventory } from "react-icons/md";
import { FaPlay } from "react-icons/fa";

const NavLayoutGame: React.FC = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const leftNavItems = [
        { path: "/", icon: <HiMiniHome size={24} /> },
        { path: "/settings", icon: <IoSettingsSharp size={24} /> },
        { path: "/logout", icon: <FiLogOut size={24} /> }
    ];

    const centerNavItems = [
        { path: "/inventory", icon: <MdInventory />, label: "Inventory" },
        { path: "/play", icon: <FaPlay />, label: "Play" },
        { path: "/shop", icon: <FaShop />, label: "Store" },
        { path: "/news", icon: <FaNewspaper />, label: "News" }
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        }

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <div className="flex flex-row p-2 items-center w-full bg-[#1A1B22] bg-opacity-30 relative">
            <div className="flex items-center gap-4">
                {leftNavItems.map((item, index) => (
                    <Link 
                        key={index} 
                        to={item.path} 
                        className={`text-white transition-opacity duration-300 ${location.pathname === item.path ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
                    >
                        {item.icon}
                    </Link>
                ))}
            </div>

            <nav className="flex flex-row justify-center w-full">
                <div className="flex flex-row items-center gap-8">
                    {centerNavItems.map((item, index) => (
                        <div key={index} className={`flex flex-row items-center transition-opacity duration-300 ${location.pathname === item.path ? "opacity-100" : "opacity-50 hover:opacity-100"}`}>
                            <Link to={item.path} className="text-white flex items-center">
                                {item.icon}
                            </Link>
                            <Link to={item.path} className="text-white ml-1">
                                {item.label}
                            </Link>
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default NavLayoutGame;