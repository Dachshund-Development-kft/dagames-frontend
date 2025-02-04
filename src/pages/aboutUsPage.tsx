import React, {useMemo} from 'react';
import { FaDiscord, FaGithub, FaSteam } from 'react-icons/fa';
import NavLayout from '../components/navLayout';

const TeamMember: React.FC<{ member: any }> = ({ member }) => {
    return (
        <div className="group relative bg-black bg-opacity-30 rounded-2xl p-8 w-72 text-center shadow-xl transform transition-all duration-300 hover:scale-105">
            <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-white shadow-md"
                loading="lazy"
            />
            <h2 className="text-2xl font-bold mb-2 text-white">{member.name}</h2>
            <span className="inline-block bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {member.role}
            </span>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 rounded-2xl">
                <p className="mb-4 italic">"{member.quote}"</p>
                <div className="flex gap-4">
                    {Object.entries(member.socials).map(([key, url]) => (
                        <a
                            key={key}
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-400">
                            {key === 'discord' && <FaDiscord size={24} />}
                            {key === 'github' && <FaGithub size={24} />}
                            {key === 'steam' && <FaSteam size={24} />}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AboutUsPage: React.FC = () => {
    const teamMembers = useMemo(() => [
        {
            name: "Balló Benedek",
            role: "Projektvezető",
            image: "https://avatars.githubusercontent.com/u/90302291?v=4",
            quote: "Leading teams to success, one project at a time.",
            socials: {
                discord: "https://discord.com/users/801162422580019220",
                github: "https://github.com/b3ni15",
                steam: "https://steamcommunity.com/profiles/76561199512453336/"
            }
        },
        {
            name: "Guti Balázs",
            role: "Szoftverfejlesztő",
            image: "https://avatars.githubusercontent.com/u/98970569?v=4",
            quote: "Striving for clean code and elegant designs.",
            socials: {
                discord: "https://discord.com/users/691581143669276692",
                github: "https://github.com/baluka0013",
                steam: "https://steamcommunity.com/id/LilKubikACreeperr"
            }
        },
        {
            name: "Domokos Ádám Péter",
            role: "Szoftverfejlesztő",
            image: "https://avatars.githubusercontent.com/u/195280489?v=4",
            quote: "Passionate about creating seamless user experiences.",
            socials: {
                discord: "https://discord.com/users/1006581830880874618",
                github: "https://github.com/Breadman7180",
                steam: "https://steamcommunity.com/id/krumplisteszta69"
            }
        },
        {
            name: "Meicher Zoltán",
            role: "Webfejlesztő",
            image: "https://avatars.githubusercontent.com/u/117442499?v=4",
            quote: "Turning ideas into interactive interfaces.",
            socials: {
                discord: "https://discord.com/users/1015296418686189628",
                github: "https://github.com/MZoltan7"
            }
        }
    ], []);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-[#0F1015]" style={{ backgroundImage: "url(/blobs.svg)" }}>
            <NavLayout />
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 my-14">
                        <div className="relative w-full md:w-auto flex justify-center md:justify-start">
                            <img
                                src="/mainPageLogo.svg"
                                alt="Dachshund Logo"
                                className="relative w-52 h-52 lg:w-64 lg:h-64 2xl:w-80 2xl:h-80 z-10 md:mr-8 sm:mr-0" />
                        </div>
                        <div className="w-full md:w-auto flex flex-col text-center md:text-left pl-0 md:pl-2">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5E78FF] to-[#384899] text-transparent bg-clip-text">
                                <span>Dachshund</span><br />
                                <span className="text-white">Development</span>
                            </h1>
                            <p className="text-gray-300 italic mt-2 text-2xl">
                                Sigma app, sigma dolgok...
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#291E7C] rounded-2xl shadow-xl p-8  sm:max-w-md md:max-w-2xl text-center md:pl-24 md:pr-24 md:pt-12 md:pb-12 mb-12" style={{ backgroundColor: 'rgba(41, 30, 124, 0.12)' }}>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-[#5E78FF] to-[#384899] text-transparent bg-clip-text">Rólunk</h2>
                        <p className="md:text-lg sm:text-sm text-gray-300 mb-4 text-left">
                            A Dachshund Development elkötelezett az innovatív és hatékony informatikai
                            megoldások iránt. Célunk, hogy segítsük ügyfeleinket a digitális térben való fejlődésben
                            modern technológiákkal és szakértelemmel.
                        </p><br />
                        <ul className="md:text-lg sm:text-sm text-gray-400 text-left list-disc pl-6">
                            <li>
                                <span className="text-white font-semibold">Webfejlesztés:</span> Felhasználóbarát weboldalak és alkalmazások.
                            </li>
                            <li>
                                <span className="text-white font-semibold">Egyedi szoftverfejlesztés:</span> Testreszabott megoldások.
                            </li>
                            <li>
                                <span className="text-white font-semibold">IT-infrastruktúra menedzsment:</span> Stabil rendszerek tervezése és üzemeltetése.
                            </li>
                        </ul><br />
                        <p className="md:text-lg sm:text-sm text-gray-300 mt-4 text-left">
                            Hiszünk abban, hogy az informatika az innováció és a fejlődés kulcsa. Fedezzük fel együtt a digitális lehetőségeket!
                        </p>
                    </div>
            <div className="flex flex-col items-center py-16 px-4">
                <h1 className="text-white text-5xl font-bold mb-12 text-center">Our team</h1>
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-screen-xl mt-16">
                    {teamMembers.map((member, index) => (
                        <TeamMember key={index} member={member} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default AboutUsPage;