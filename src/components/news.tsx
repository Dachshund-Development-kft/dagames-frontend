import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // Markdown támogatás
import remarkGfm from 'remark-gfm'; // GitHub Flavored Markdown támogatás
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-black bg-opacity-90 text-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4">
                        <h2 className="text-2xl font-bold mb-4 text-center">{news.name}</h2>

                        <div className="text-center">
                            <ReactMarkdown
                                className="prose prose-invert"
                                remarkPlugins={[remarkGfm]}>
                                {news.body}
                            </ReactMarkdown>
                        </div>
                        <br />
                        <div className="flex items-center justify-center mb-6">
                            <img
                                src={news.author.avatar}
                                alt={news.author.name}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <span className="text-sm">{news.author.name}</span>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleClosePopup}
                                className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600"
                            >
                                Bezárás
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NewsLayout;