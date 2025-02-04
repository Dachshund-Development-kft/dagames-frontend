import React from 'react';

const MainPage: React.FC = () => {
    return (
        <main className='flex flex-col items-center justify-center min-h-screen bg-[#0F1015]'>
            <div className="flex flex-col md:flex-row items-center mb-10 ml-0 md:ml-24 space-y-6 md:space-y-0 md:mt-0 lg:mb-48">
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

                    <div className="bg-[#291E7C] rounded-2xl shadow-xl p-8  sm:max-w-md md:max-w-2xl text-center md:pl-24 md:pr-24 md:pt-12 md:pb-12" style={{ backgroundColor: 'rgba(41, 30, 124, 0.12)' }}>
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
        </main>
    );
};

export default MainPage;