import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './auth_context';

const SocketContext = createContext({ socket: null });

export const SocketProvider = ({ children }) => {
    const { accessToken } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!accessToken) return;

        const newSocket = io('http://localhost:8000', {
            withCredentials: true,
            auth: { token: accessToken },
            transports: ['websocket'],
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [accessToken]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);