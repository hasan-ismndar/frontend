import { useState } from 'react';
import { useAuth } from '@/contexts/auth_context';
import styles from '../styles/login.module.css';

export default function LoginPage() {
    const { login } = useAuth();
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
            console.log(err);
            setError(err.response?.data?.message || 'فشل تسجيل الدخول');
        }
        finally {
            setPending(false);
        }

    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <input
                    // type="email"
                    placeholder=" إسم المستخدم أو البريد الإلكتروني"
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
                    {pending ? "جاري الدخول..." : "تسجيل الدخول "}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>

    );
}

