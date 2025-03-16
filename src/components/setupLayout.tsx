import { useState, useEffect } from 'react';
import { getShopItems } from '../api/shopItem';
import { setup } from '../api/setup';
import Loading from './loading';
import { toast } from 'react-toastify';

const SetupLayout = ({ onComplete }: { onComplete: () => void }) => {
    const [characters, setCharacters] = useState<{ id: string; name: string; image: string; stats?: any }[]>([]);
    const [weapons, setWeapons] = useState<{ id: string; name: string; image: string; stats?: any }[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [hoveredItem, setHoveredItem] = useState<{ type: 'character' | 'weapon'; id: string; stats: any } | null>(null);
    const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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
                    stats: {
                        power: formatStatRange(item.stat_power_from, item.stat_power_to),
                        speed: formatStatRange(item.stat_speed_from, item.stat_speed_to),
                        agility: formatStatRange(item.stat_agility_from, item.stat_agility_to)
                    },
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
                    stats: {
                        speed: formatStatRange(item.stat_speed_from, item.stat_speed_to),
                        defense: formatStatRange(item.stat_defense_from, item.stat_defense_to),
                        damage: formatStatRange(item.stat_damage_from, item.stat_damage_to),
                        attack: formatStatRange(item.stat_attack_from, item.stat_attack_to),
                    },
                }));
                setWeapons(formattedWeapons);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('There was an error loading the items in.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatStatRange = (from: number, to: number) => {
        return from === to ? `${from}` : `${from}-${to}`;
    };

    const handleCharacterSelect = (id: string) => {
        setSelectedCharacter(id);
        setSelectedWeapon(null);
    };

    const handleWeaponSelect = (id: string) => {
        setSelectedWeapon(id);
    };

    const getFilteredWeapons = () => {
        if (!selectedCharacter) {
            return [];
        }

        const character = characters.find(c => c.id === selectedCharacter);
        if (!character) {
            return [];
        }

        switch (character.name) {
            case 'Warrior':
                return weapons.filter(weapon => ['Sword', 'Mace', 'Broadsword'].includes(weapon.name));
            case 'Rogue':
                return weapons.filter(weapon => ['Dagger', 'Sword'].includes(weapon.name));
            case 'Priest':
                return weapons.filter(weapon => ['Staff', 'Mace', 'Sword', 'Dagger'].includes(weapon.name));
            default:
                return [];
        }
    };

    const handleSubmit = async () => {
        if (!selectedCharacter || !selectedWeapon) {
            alert('Choose a starter character and weapon!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Unauthorized.');
            }

            const response = await setup(selectedWeapon, selectedCharacter);

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error(errorData.message || 'There was an error during requests.');
            }

            const result = response.data;
            if (result.success) {
                onComplete();
            } else {
                throw new Error('The selection was unsuccessful');
            }
        } catch (error) {
            console.error('Error submitting selection:', error);
            toast.error((error as Error).message || 'Error submitting selection.');
        }
    };

    const handleMouseEnter = (type: 'character' | 'weapon', id: string, stats: any, event: React.MouseEvent) => {
        setHoveredItem({ type, id, stats });
        setHoverPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    const filteredWeapons = getFilteredWeapons();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-black bg-opacity-50 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[75vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Choose your starter character and weapon!</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Characters</h3>
                        <div className="flex flex-wrap gap-4">
                            {characters.map((character) => (
                                <div key={character.id} className={`cursor-pointer p-2 rounded-lg ${selectedCharacter === character.id ? 'bg-blue-500' : 'backdrop-blur-md'}`} onClick={() => handleCharacterSelect(character.id)} onMouseEnter={(e) => handleMouseEnter('character', character.id, character.stats, e)} onMouseLeave={handleMouseLeave} >
                                    <img src={character.image} alt={character.name} className="w-32 h-32 rounded-full object-cover pixelart" />
                                    <p className="text-white text-center">{character.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Weapons</h3>
                        {!selectedCharacter ? (
                            <p className="text-white">Please select a character to see available weapons.</p>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {filteredWeapons.map((weapon) => (
                                    <div key={weapon.id} className={`cursor-pointer p-2 rounded-lg ${selectedWeapon === weapon.id ? 'bg-blue-500' : 'backdrop-blur-md'}`} onClick={() => handleWeaponSelect(weapon.id)} onMouseEnter={(e) => handleMouseEnter('weapon', weapon.id, weapon.stats, e)} onMouseLeave={handleMouseLeave} >
                                        <img src={weapon.image} alt={weapon.name} className="w-32 h-32 rounded-full object-cover mx-auto pixelart" />
                                        <p className="text-white text-center">{weapon.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={handleSubmit} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                        Confirm
                    </button>
                </div>
            </div>

            {hoveredItem && (
                <div className="absolute backdrop-blur-md bg-black bg-opacity-50 p-4 rounded-lg shadow-lg text-white" style={{ top: hoverPosition.y + 10, left: hoverPosition.x + 10 }}>
                    <h4 className="font-bold mb-2">{hoveredItem.type === 'character' ? 'Character stats' : 'Weapon Stats'}</h4>
                    {Object.entries(hoveredItem.stats).map(([key, value]) => (
                        <p key={key}>{`${key}: ${value}`}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SetupLayout;