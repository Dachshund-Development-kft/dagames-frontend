import React, { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/navLayoutGame';
import { me } from '../../api/me';
import { fetchShopItems, fetchShopItemById, buyItem, ShopItem } from '../../api/shop';
import { inventory } from '../../api/inventory';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const InventoryPage: React.FC = () => {
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [ownedItems, setOwnedItems] = useState<string[]>([]);
    const [coins, setCoins] = useState<number>(0);
    const [showPopup, setShowPopup] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await me();
                console.log(response.username);
            } catch (err) {
                localStorage.removeItem('token');
                console.error(err);
                window.location.href = '/login';
            }
        };

        const loadData = async () => {
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
                setError('Failed to load shop items or inventory.');
                setLoading(false);
            }
        };

        loadData();
        fetchData();
    }, []);

    const handleItemClick = async (itemId: string) => {
        try {
            const item = await fetchShopItemById(itemId);
            setSelectedItem(item);
            setShowPopup(true);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Failed to load item details.');
            } else {
                setError('Failed to load item details.');
            }
        }
    };

    const handleBuyClick = async () => {
        if (!selectedItem) return;

        if (ownedItems.includes(selectedItem.id)) {
            toast.warning('You already own this item.');
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
                setError(error.message || 'Failed to buy item.');
            } else {
                setError('Failed to buy item.');
            }
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedItem(null);
    };

    if (loading) {
        return <div>Loading shop items...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <main className='flex flex-col items-center justify-center min-h-screen bg-[#0F1015] no-scrollbar' style={{ backgroundImage: "url(/blobs.svg)" }}>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center gap-4 p-4'>
                <div className="flex flex-col items-center justify-center w-full max-w-[1400px] p-4">
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                        transition={Bounce}
                    />
                    <div className="self-start mb-4">
                        <p className="text-lg font-bold text-white">Coins: {coins}</p>
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-white">Shop Items</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {shopItems.map((item) => (
                            <div key={item._id} className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative bg-black bg-opacity-30" onClick={() => handleItemClick(item.id)} >
                                {ownedItems.includes(item.id) && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                        <span className="text-red-500 text-2xl font-bold">Owned</span>
                                    </div>
                                )}
                                <h2 className="text-xl font-semibold text-white">{item.name}</h2>
                                <p className="text-gray-500">{item.description}</p>
                                <p className="text-green-600 font-bold">${item.price}</p>
                                {item.image && (
                                    <img src={item.image} alt={item.name} className="mt-4 rounded-lg" />
                                )}
                            </div>
                        ))}
                    </div>

                    {showPopup && selectedItem && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                                <h2 className="text-2xl font-bold mb-4 text-white">{selectedItem.name}</h2>
                                <p className="text-gray-300 mb-4">{selectedItem.description}</p>
                                <p className="text-green-500 font-bold mb-4">${selectedItem.price}</p>
                                {selectedItem.image && (
                                    <img src={selectedItem.image} alt={selectedItem.name} className="mb-4 rounded-lg w-full" />
                                )}
                                <button onClick={handleBuyClick} className={`w-full px-4 py-2 text-white rounded-lg transition-colors ${ownedItems.includes(selectedItem.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`} disabled={ownedItems.includes(selectedItem.id)}>
                                    {ownedItems.includes(selectedItem.id) ? 'Owned' : 'Buy Now'}
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

export default InventoryPage;