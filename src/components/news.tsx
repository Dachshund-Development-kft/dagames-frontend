import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getNews } from '../api/news';

interface ApiResponse {
    maintenance: boolean;
    message: string | null;
    news: {
        tag_name: string;
        name: string;
        body: string;
        published_at: string;
        author: {
            name: string;
            avatar: string;
        };
    };
}

const NewsLayout: React.FC = () => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [news, setNews] = useState<ApiResponse['news'] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: ApiResponse = await getNews();
                const lastReadDate = localStorage.getItem('lastReadNewsDate');
                
                if (lastReadDate !== response.news.published_at) {
                    setNews(response.news);
                    setShowPopup(true);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const handleClosePopup = () => {
        if (news) {
            localStorage.setItem('lastReadNewsDate', news.published_at);
            setShowPopup(false);
        }
    };

    return (
        <>
            {showPopup && news && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
                    <div 
                        className="bg-black bg-opacity-90 text-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-12 flex flex-col"
                        style={{ maxHeight: '75vh', overflowY: 'auto' }}
                    >
                        {/* News Content */}
                        <div className="flex-1 overflow-y-auto">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">{news.name}</h2>
                            <div className="prose prose-invert">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{news.body}</ReactMarkdown>
                            </div>
                        </div>

                        {/* Author and Close Button */}
                        <div className="mt-6">
                            <div className="flex items-center justify-center mb-6">
                                <img
                                    src={news.author.avatar}
                                    alt={news.author.name}
                                    className="w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 rounded-full mr-3"
                                />
                                <span className="text-sm sm:text-base md:text-lg">{news.author.name}</span>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={handleClosePopup}
                                    className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600 sm:px-8 sm:py-3 md:px-10 md:py-4"
                                >
                                    Bezárás
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NewsLayout;