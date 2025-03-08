import React, { useState } from 'react';
import NavLayoutGame from '../../components/nav';
import ReportPopup from '../../components/reportPopup';

const SettingsPage: React.FC = () => {
    const [isReportPopupOpen, setIsReportPopupOpen] = useState(false);

    return (
        <main className='flex flex-col items-center justify-center min-h-screen'>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center gap-4 text-black'>
                <button
                    onClick={() => setIsReportPopupOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Report Button
                </button>
                {isReportPopupOpen && (
                    <ReportPopup onClose={() => setIsReportPopupOpen(false)} />
                )}
            </div>
        </main>
    );
};

export default SettingsPage;