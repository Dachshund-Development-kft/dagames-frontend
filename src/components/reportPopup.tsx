import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReportPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [type, setType] = useState<'bug' | 'idea'>('bug');
    const [from, setFrom] = useState<'frontend' | 'backend'>('frontend');
    const [description, setDescription] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.altKey && event.key === 't') {
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleSubmit = async () => {
        if (!description.trim()) {
            toast.error('Please provide a description.');
            return;
        }

        try {
            const response = await axios.post('https://api.dagames.online/v1/user/@me/report', {
                type,
                from,
                description,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.success) {
                toast.success('Report submitted successfully!');
                onClose();
                setIsVisible(false);
            } else {
                toast.error('Failed to submit report. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">Report an Issue or Suggest an Idea</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Is it backend or frontend?</label>
                        <select value={from} onChange={(e) => setFrom(e.target.value as 'frontend' | 'backend')} className="mt-1 block w-full p-2 bg-gray-800 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500" >
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Is it a bug or idea?</label>
                        <select value={type} onChange={(e) => setType(e.target.value as 'bug' | 'idea')} className="mt-1 block w-full p-2 bg-gray-800 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500" >
                            <option value="bug">Bug</option>
                            <option value="idea">Idea</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full p-2 bg-gray-800 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500" rows={4} placeholder="Provide a detailed description..." />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsVisible(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300" >
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300" >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} className={'z-50'} />
        </div>
    );
};

export default ReportPopup;