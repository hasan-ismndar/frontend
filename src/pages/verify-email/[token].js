import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
    const router = useRouter();
    const { token } = router.query;

    const [message, setMessage] = useState("جاري تأكيد بريدك...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const verifyEmail = async () => {
            try {
                console.log(token);
                const res = await fetch(`http://localhost:8000/verify-email/${token}`);

                const data = await res.json();

                if (res.ok) {
                    setMessage("✅ تم تأكيد بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.");
                } else {
                    setMessage(data.error || "❌ رابط التفعيل غير صالح أو منتهي.");
                }
            } catch (err) {
                console.log(err);
                setMessage("⚠️ فشل الاتصال بالسيرفر.");
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div style={{ maxWidth: 500, margin: "100px auto", textAlign: "center", fontFamily: "Arial" }}>
            <h2>{loading ? "🔄 جاري التحقق..." : message}</h2>
            {!loading && (
                <button
                    onClick={() => router.push("/login")}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#0070f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    الذهاب إلى تسجيل الدخول
                </button>
            )}
        </div>
    );
}