import { useSocket } from '@/contexts/socket_context';
import ChatBox from '@/components/ChatBox';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
export default function ChatRoomPage() {
    const { socket } = useSocket();
    const router = useRouter();
    const [messages, setMessages] = useState([]);

    const { id: projectId } = router.query;
    useEffect(() => {
        if (!socket || !projectId) return;

        socket.emit('join-room', projectId);
        socket.on('room-message-history', (msgs) => {
            setMessages(msgs);
        });
        console.log(socket);
        console.log(projectId);

        return () => {
            socket.off('room-message-history');
            socket.emit('leave-room', projectId);
        };

    }, [socket, projectId]);

    if (!socket || !projectId) return <p>جارٍ الاتصال...</p>;

    return (
        <div style={{ padding: 20 }}>
            <h1>دردشة المشروع #{projectId}</h1>
            <ChatBox socket={socket} currentProject={projectId} messagesHistory={messages} />
        </div>
    );
}