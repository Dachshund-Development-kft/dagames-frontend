import React, { useEffect, useState, useCallback } from 'react';
import NavLayoutGame from '../../components/nav';
import { fetchShopItems, fetchShopItemById, buyItem, ShopItem } from '../../api/shop';
import { inventory } from '../../api/inventory';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import Loading from '../../components/loading';
import type { JSX } from 'react';

const StorePage: React.FC = () => {
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error] = useState<string | null>(null);
    const [ownedItems, setOwnedItems] = useState<string[]>([]);
    const [coins, setCoins] = useState<number>(0);
    const [showPopup, setShowPopup] = useState<boolean>(false);

    const loadData = useCallback(async () => {
        try {
            const userResponse = await fetch('https://api.dagames.online/v1/user/@me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await userResponse.json();
            setCoins(userData.coins);

            const items = await fetchShopItems();
            setShopItems(items);

            const inventoryResponse = await inventory();
            const ownedItemIds = inventoryResponse.map((item: any) => item.id);
            setOwnedItems(ownedItemIds);

            setLoading(false);
        } catch (err) {
            toast.error('Failed to load shop items or inventory.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleItemClick = async (itemId: string) => {
        try {
            const item = await fetchShopItemById(itemId);
            setSelectedItem(item);
            setShowPopup(true);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to load item details.');
            } else {
                toast.error('Failed to load item details.');
            }
        }
    };

    const handleBuyClick = async () => {
        if (!selectedItem) return;

        if (coins < selectedItem.price) {
            toast.error('You do not have enough coins to buy this item.');
            return;
        }

        try {
            const result = await buyItem(selectedItem.id);
            if (result.success) {
                toast.success('Purchase successful!');
                setOwnedItems([...ownedItems, selectedItem.id]);
                setCoins(coins - selectedItem.price);
                setShowPopup(false);
            } else {
                toast.error(result.message || 'Failed to buy item.');
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to buy item.');
            } else {
                toast.error('Failed to buy item.');
            }
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedItem(null);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const formatStatRange = (from: number | undefined, to: number | undefined): string | null => {
        if (from === undefined || to === undefined) return null;
        return from === to ? `${from}` : `${from}-${to}`;
    };

    const renderStat = (label: string, from: number | undefined, to: number | undefined): JSX.Element | null => {
        const statRange = formatStatRange(from, to);
        if (!statRange) return null;
        return <p>{`${label}: ${statRange}`}</p>;
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        toast.error(error);
    }

    return (
        <main className='flex flex-col items-center justify-center min-h-screen overflow-hidden'>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center gap-4 p-4 h-[calc(100vh-56px)]'>
                <div className="flex flex-col items-center justify-center w-full max-w-[1400px] p-4">
                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} />
                    <div className="self-start mb-4">
                        <p className="text-lg font-bold text-white">Coins: {coins}</p>
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-white">Shop Items</h1>
                    <div className="w-full overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {shopItems.map((item) => (
                                <div key={item._id} className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative bg-black bg-opacity-50 backdrop-blur-md" onClick={() => handleItemClick(item.id)} >
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-semibold text-white">{item.name}</span>
                                        {ownedItems.includes(item.id) && (
                                            <span className="text-red-500 text-2xl font-bold mr-3">Owned</span>
                                        )}
                                    </div>
                                    <p className="text-gray-500">{item.description}</p>
                                    <p className="text-green-600 font-bold">${item.price}</p>
                                    {item.image && (
                                        <img src={item.image} alt={item.name} className="mt-4 rounded-3xl  " style={{ width: "100%" }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {showPopup && selectedItem && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-black bg-opacity-50 backdrop-blur-md p-6 rounded-lg w-full max-w-md max-h-[70vh] my-auto">
                                <h2 className="text-2xl font-bold mb-4 text-white">{selectedItem.name}</h2>
                                <p className="text-gray-300 mb-4">{selectedItem.description}</p>
                                <p className="text-green-500 font-bold mb-4">${selectedItem.price}</p>
                                {selectedItem.image && (
                                    <img src={selectedItem.image} alt={selectedItem.name} className="mb-4 rounded-full w-64 object-cover" />
                                )}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-white mb-2">Possible Stats</h3>
                                    <div className="text-gray-300">
                                        {renderStat('Power', selectedItem.stat_power_from, selectedItem.stat_power_to)}
                                        {renderStat('Speed', selectedItem.stat_speed_from, selectedItem.stat_speed_to)}
                                        {renderStat('Agility', selectedItem.stat_agility_from, selectedItem.stat_agility_to)}
                                        {renderStat('Defense', selectedItem.stat_defense_from, selectedItem.stat_defense_to)}
                                        {renderStat('Damage', selectedItem.stat_damage_from, selectedItem.stat_damage_to)}
                                        {renderStat('Attack', selectedItem.stat_attack_from, selectedItem.stat_attack_to)}
                                    </div>
                                </div>
                                <button onClick={handleBuyClick} className={`w-full px-4 py-2 text-white rounded-lg transition-colors bg-blue-500 hover:bg-blue-600`}>
                                    Buy Now
                                </button>
                                <button onClick={handleClosePopup} className="w-full mt-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg">
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default StorePage;
