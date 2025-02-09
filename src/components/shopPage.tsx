import React, { useEffect, useState } from 'react';
import { fetchShopItems, fetchShopItemById, buyItem, ShopItem } from '../api/shop';
import { inventory } from '../api/inventory';

const ShopPage: React.FC = () => {
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [ownedItems, setOwnedItems] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
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
    }, []);

    const handleItemClick = async (itemId: string) => {
        try {
            const item = await fetchShopItemById(itemId);
            setSelectedItem(item);
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
            alert('You already own this item.');
            return;
        }

        const confirmPurchase = window.confirm(`Do you want to buy ${selectedItem.name} for $${selectedItem.price}?`);
        if (confirmPurchase) {
            try {
                const result = await buyItem(selectedItem.id);
                if (result.success) {
                    alert('Purchase successful!');
                    setOwnedItems([...ownedItems, selectedItem.id]);
                } else {
                    alert(result.message || 'Failed to buy item.');
                }
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message || 'Failed to buy item.');
                } else {
                    setError('Failed to buy item.');
                }
            }
        }
    };

    if (loading) {
        return <div>Loading shop items...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[1400px] p-4">
            <h1 className="text-2xl font-bold mb-4">Shop Items</h1>
            {selectedItem && (
                <div className="w-full mb-8 p-4 border rounded-lg bg-gray-100">
                    <h2 className="text-2xl font-bold mb-4">Selected Item</h2>
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
                        <p className="text-gray-600">{selectedItem.description}</p>
                        <p className="text-green-600 font-bold">${selectedItem.price}</p>
                        {selectedItem.image && (
                            <img
                                src={selectedItem.image}
                                alt={selectedItem.name}
                                className="mt-4 rounded-lg max-w-[200px]"
                            />
                        )}
                        <button
                            onClick={handleBuyClick}
                            className={`mt-4 px-4 py-2 text-white rounded-lg transition-colors ${
                                ownedItems.includes(selectedItem.id)
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                            disabled={ownedItems.includes(selectedItem.id)}
                        >
                            {ownedItems.includes(selectedItem.id) ? 'Owned' : 'Buy Now'}
                        </button>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shopItems.map((item) => (
                    <div
                        key={item._id}
                        className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
                        onClick={() => handleItemClick(item.id)}
                    >
                        {ownedItems.includes(item.id) && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                <span className="text-red-500 text-2xl font-bold">Owned</span>
                            </div>
                        )}
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="text-gray-600">{item.description}</p>
                        <p className="text-green-600 font-bold">${item.price}</p>
                        {item.image && (
                            <img
                                src={item.image}
                                alt={item.name}
                                className="mt-4 rounded-lg"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopPage;