import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMiniHome } from "react-icons/hi2";
import { FaNewspaper, FaShop } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { MdInventory } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { me } from '../api/me';
import { MdLeaderboard } from "react-icons/md";
import { useMediaQuery } from 'react-responsive';

const NavLayoutGame: React.FC = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 });

    const leftNavItems = [
        { path: "/", icon: <HiMiniHome size={24} /> },
        { path: "/logout", icon: <FiLogOut size={24} /> }
    ];

    const centerNavItems = [
        { path: "/inventory", icon: <MdInventory />, label: "Inventory" },
        { path: "/play", icon: <FaPlay />, label: "Play" },
        { path: "/leaderboard", icon: <MdLeaderboard />, label: "Leaderboard" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await me();

                if (response) {
                    return;
                }
            } catch (err) {
                localStorage.removeItem('token');
                console.error(err);
                window.location.href = '/login';
            }
        };

        fetchData();
    }, []);

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

        function handleScroll() {
            setIsMenuOpen(false);
        }

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            window.addEventListener("scroll", handleScroll);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isMenuOpen]);

    if (!isDesktopOrLaptop) {
        return (
            <div className="flex flex-row p-2 items-center w-full bg-black bg-opacity-50 backdrop-blur-md z-10">
                <div className="flex items-center gap-4 py-2">
                    {leftNavItems.map((item, index) => (
                        <Link key={index} to={item.path} className={`text-white transition-opacity duration-300 ${location.pathname === item.path ? "opacity-100" : "opacity-50 hover:opacity-100"}`}>
                            {item.icon}
                        </Link>
                    ))}
                </div>

                <button ref={menuButtonRef} onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-auto text-white focus:outline-none mr-3">☰</button>
                <div ref={menuRef} style={{ transform: `translatey(${isMenuOpen ? 0 : -500}px)`, transition: 'transform 0.3s ease-in-out', marginTop: '3.5rem' }} className="fixed top-0 right-0 h-42 rounded-lg w-64 bg-black bg-opacity-70 backdrop-blur-md " >
                    <nav className="flex flex-col items-start p-4 z-50">
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
                    </nav>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-row p-2 items-center w-full bg-black bg-opacity-50 backdrop-blur-md z-50">
            <div className="flex items-center gap-4 py-2">
                {leftNavItems.map((item, index) => (
                    <Link key={index} to={item.path} className={`text-white transition-opacity duration-300 ${location.pathname === item.path ? "opacity-100" : "opacity-50 hover:opacity-100"}`}>
                        {item.icon}
                    </Link>
                ))}
            </div>

            <nav className="flex flex-row justify-center w-full">
                <div className="flex flex-row items-center gap-8 pl-auto pr-auto">
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