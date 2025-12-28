import { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaPaperPlane, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Hide on admin routes
    if (location.pathname.startsWith('/admin')) return null;

    const [messages, setMessages] = useState([
        { text: "Hi there! How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/chat', { message: userMsg });
            setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting.", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-secondary transition-transform hover:scale-110"
                >
                    <FaCommentDots size={24} />
                </button>
            )}

            {isOpen && (
                <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] border border-gray-200">
                    <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-bold">Dental Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
                            <FaTimes />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.isBot
                                    ? 'bg-white text-gray-800 shadow-sm rounded-tl-none'
                                    : 'bg-primary text-white shadow-sm rounded-tr-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-500 p-3 rounded-lg shadow-sm text-xs">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-4 border-t bg-white rounded-b-lg flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-primary"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white p-2 rounded-full hover:bg-secondary disabled:opacity-50"
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
