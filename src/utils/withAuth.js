import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/contexts/auth_context';

export default function withAuth(Component) {
    return function ProtectedRoute(props) {
        const router = useRouter();
        const [loading, setLoading] = useState(true);
        const [user, setUser] = useState(null);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const res = await api.post('/refresh');
                    const token = res.data.accessToken;
                    const userRes = await api.get('/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(userRes.data.user);
                } catch {
                    router.push('/login');
                } finally {
                    setLoading(false);
                }
            };

            checkAuth();
        }, []);

        if (loading) return <p>جاري التحقق من الهوية...</p>;

        return <Component {...props} user={user} />;
    };
}
