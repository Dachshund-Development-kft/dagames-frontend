import React, { useEffect, useState } from 'react';
import NavLayoutGame from '../../components/nav';
import Loading from '../../components/loading';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getNews } from '../../api/newspage';

interface NewsItem {
    tag_name: string;
    name: string;
    body: string;
    published_at: string;
    author: {
        name: string;
        avatar: string;
    };
}

interface ApiResponse {
    maintenance: boolean;
    message: string | null;
    news: NewsItem[];
}

const InventoryPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [news, setNews] = useState<NewsItem[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: ApiResponse = await getNews();
                setNews(response.news);
                setLoading(false);
            } catch (err) {
                localStorage.removeItem('token');
                console.error(err);
                window.location.href = '/login';
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (loading) return <Loading />;
    if (!news) return null;

    return (
        <main className='flex flex-col items-center justify-center min-h-screen overflow-hidden'>
            <NavLayoutGame />
            <div className='flex flex-grow items-center justify-center w-full'>
                <div className="w-full overflow-y-auto max-h-[calc(100vh-56px)] p-4 scrollbar-hide">
                    <div className="space-y-8 max-w-2xl w-full mx-auto">
                        {news.map((item, index) => (
                            <div key={index} className="bg-black bg-opacity-50 backdrop-blur-md text-white p-8 rounded-lg shadow-lg">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">{item.name}</h2>
                                <div className="overflow-y-auto max-h-96 prose prose-invert sm:max-h-[30rem] md:max-h-[35rem] lg:max-h-[40rem]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.body}</ReactMarkdown>
                                </div>
                                <br />
                                <div className="flex items-center justify-center mb-6">
                                    <img
                                        src={item.author.avatar}
                                        alt={item.author.name}
                                        className="w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 rounded-full mr-3"
                                    />
                                    <span className="text-sm sm:text-base md:text-lg">{item.author.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default InventoryPage;