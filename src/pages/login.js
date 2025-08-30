import { useState } from 'react';
import { useAuth } from '@/contexts/auth_context';
import styles from '../styles/login.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [credentials, setCredentials] = useState('');
    const [password, setPassword] = useState('');
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPending(true);

        try {
            await login(credentials, password);
        } catch (err) {
            const message = err.response?.data?.error || 'فشل تسجيل الدخول';

            if (err.response?.status === 403 && err.response?.data?.needVerification) {
                router.push("/check-email");
                return;
            }

            setError(message);
        } finally {
            setPending(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            {error && <p style={{ color: 'red', marginBottom: '2px' }}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <input
                    placeholder="إسم المستخدم أو البريد الإلكتروني"
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    disabled={pending}
                    style={{ padding: "10px", width: "100%" }}
                >
                    {pending ? "جاري الدخول..." : "تسجيل الدخول"}
                </button>
            </form>

            <div style={{ marginTop: "10px", textAlign: "center" }}>
                <Link href="/forget-password" style={{ padding: '5px', display: "block" }}>
                    هل نسيت كلمة المرور ؟
                </Link>
                <Link href="/register" style={{ padding: '5px', display: "block", color: "#2563eb" }}>
                    ليس لديك حساب؟ أنشئ حساب جديد
                </Link>
            </div>
        </div>
    );
}