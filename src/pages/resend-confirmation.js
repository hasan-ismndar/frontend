import { useState } from "react";
import { useRouter } from "next/router";

export default function ResendConfirmation() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            console.log(res);
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "حدث خطأ");
            } else {
                router.push("/check-email");
            }
        } catch (err) {
            alert("فشل الاتصال بالخادم.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial" }}>
            <h2>🔄 إعادة إرسال رابط التفعيل</h2>
            <p>يرجى إدخال بريدك الإلكتروني وكلمة المرور لإعادة إرسال رابط التفعيل.</p>

            <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />
            <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: 10, marginBottom: 20 }}
            />

            <button
                type="submit"
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: loading ? "not-allowed" : "pointer"
                }}
            >
                {loading ? "يتم الإرسال..." : "إرسال الرابط مجددًا"}
            </button>
        </form>
    );
}
