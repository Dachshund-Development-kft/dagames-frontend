import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0F1015] bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-white text-xl">Loading...</span>
        </div>
    );
};

export default Loading;