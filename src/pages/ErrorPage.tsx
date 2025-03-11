import React from 'react';

const ErrorPage: React.FC = () => {
    return (
        <main className='flex min-h-screen'>
            <div className='m-auto bg-black bg-opacity-50 backdrop-blur-md p-10 rounded-lg text-white'>
                <h1 className='font-bold text-2xl text-center pb-5'>Oops! 404</h1>
                <p className='text-center'>Sorry, an unexpected error has occurred.</p>
            </div>
        </main>
    );
};

export default ErrorPage;