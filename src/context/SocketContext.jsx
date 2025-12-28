import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;

        // Guard: Don't try to connect if API URL is not defined
        if (!apiUrl) {
            console.warn('VITE_API_URL is not defined. Socket connection skipped.');
            return;
        }

        const newSocket = io(apiUrl);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
