
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/contexts/auth_context';

export default function ResetPasswordPage() {
    const router = useRouter();
    const { token } = router.query;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [pending, setPending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (newPassword !== confirmPassword) {
            setError('كلمة المرور وتأكيدها غير متطابقين.');
            return;
        }
        if (!token) {
            setError('لا يوجد رمز لإعادة التعيين.');
            return;
        }

        try {
            setPending(true);
            await api.post(
                `/reset-password/${token}`,
                { newPassword },
                { withCredentials: true }
            );
            setMessage('تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err) {
            const msg = err.response?.data?.error || 'فشل تحديث كلمة المرور';
            setError(msg);
        } finally {
            setPending(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
            <h2>إعادة تعيين كلمة المرور</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message ? (
                <p style={{ color: 'green' }}>{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>كلمة المرور الجديدة:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>تأكيد كلمة المرور:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={pending}
                        style={{
                            padding: "10px",
                            backgroundColor: "#0070f3",
                            color: "white",
                            fontWeight: "bold",
                            border: "none",
                            cursor: "pointer",
                            width: "100%",
                        }}
                    >
                        {pending ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                    </button>
                </form>
            )}
        </div>
    );
}
