import { useState, useEffect } from 'react';
import { getShopItems } from '../api/shopItem';
import { setup } from '../api/setup';

const SetupLayout = ({ onComplete }: { onComplete: () => void }) => {
    const [characters, setCharacters] = useState<{ id: string; name: string; image: string }[]>([]);
    const [weapons, setWeapons] = useState<{ id: string; name: string; image: string }[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const characterIds = ["3b1b21e2fc", "d070592d6f", "ef7a4f5ba3"];
                const characterPromises = characterIds.map(async (id) => {
                    const response = await getShopItems(id);
                    return response;
                });
                const characterData = await Promise.all(characterPromises);
                const formattedCharacters = characterData.map(item => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                }));
                setCharacters(formattedCharacters);

                const weaponIds = ["a5cb18924b", "1df43eea51", "e5f10e6165", "396c2a7e11", "ad234b5421"];
                const weaponPromises = weaponIds.map(async id => {
                    const response = await getShopItems(id);
                    return response;
                });
                const weaponData = await Promise.all(weaponPromises);
                const formattedWeapons = weaponData.map(item => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                }));
                setWeapons(formattedWeapons);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Hiba történt az adatok betöltése közben.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCharacterSelect = (id: string) => {
        setSelectedCharacter(id);
    };

    const handleWeaponSelect = (id: string) => {
        setSelectedWeapon(id);
    };

    const handleSubmit = async () => {
        if (!selectedCharacter || !selectedWeapon) {
            alert('Kérlek válassz egy karaktert és egy fegyvert!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Nincs érvényes token.');
            }

            const response = await setup(selectedWeapon, selectedCharacter);

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error(errorData.message || 'Hiba történt a kérés során.');
            }

            const result = response.data;
            if (result.success) {
                onComplete();
            } else {
                throw new Error('A kiválasztás sikertelen.');
            }
        } catch (error) {
            console.error('Error submitting selection:', error);
            setError((error as Error).message || 'Hiba történt a kiválasztás során.');
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#1E1F25] p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-bold text-white mb-4">Adatok betöltése...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1E1F25] p-6 rounded-lg shadow-lg max-w-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">Válaszd ki a kezdő karaktered és fegyvered!</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Karakterek</h3>
                        <div className="flex space-x-4">
                            {characters.map((character) => (
                                <div
                                    key={character.id}
                                    className={`cursor-pointer p-2 rounded-lg ${
                                        selectedCharacter === character.id ? 'bg-blue-500' : 'bg-gray-700'
                                    }`}
                                    onClick={() => handleCharacterSelect(character.id)}
                                >
                                    <img src={character.image} alt={character.name} className="w-16 h-16" />
                                    <p className="text-white text-center">{character.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Fegyverek</h3>
                        <div className="flex space-x-4">
                            {weapons.map((weapon) => (
                                <div
                                    key={weapon.id}
                                    className={`cursor-pointer p-2 rounded-lg ${
                                        selectedWeapon === weapon.id ? 'bg-blue-500' : 'bg-gray-700'
                                    }`}
                                    onClick={() => handleWeaponSelect(weapon.id)}
                                >
                                    <img src={weapon.image} alt={weapon.name} className="w-16 h-16" />
                                    <p className="text-white text-center">{weapon.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    >
                        Kiválasztás megerősítése
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetupLayout;