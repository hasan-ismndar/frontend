import { useState } from 'react';
import { api } from '@/contexts/auth_context';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            setPending(true);
            const res = await api.post('/forgot-password', { email });
            setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
        } catch (err) {
            const msg = err.response?.data?.error || 'فشل إرسال الرابط';
            setError(msg);
        } finally {
            setPending(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
            <h2>نسيت كلمة المرور</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>البريد الإلكتروني:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <button type="submit" disabled={pending} style={{
                    padding: "10px",
                    backgroundColor: "#0070f3",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                }}>
                    {pending ? 'جارٍ الإرسال...' : 'إرسال الرابط'}
                </button>
            </form>

            {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
    );
}