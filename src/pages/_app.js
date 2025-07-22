import { AuthProvider } from "@/contexts/auth_context"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from '@/contexts/socket_context';

import { useState } from "react";
import "@/styles/globals.css";
export default function App({ Component, pageProps }) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SocketProvider>
                    <Component {...pageProps} />
                </SocketProvider>
            </AuthProvider>
        </QueryClientProvider>

    )
}