import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/contexts/auth_context";
import { useRouter } from "next/router";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullName: "",
    });

    const [error, setError] = useState("");
    const registerMutation = useMutation({
        mutationFn: async (data) => {
            const res = await api.post("http://localhost:8000/register", data);
            return res.data;
        },
        onSuccess: () => {
            setFormData({ username: "", email: "", password: "", fullName: "" });
            setError("");
            router.push("/check-email");
        },
        onError: (error) => {
            console.log(error);
            const serverError = error?.response?.data?.error;
            setError(serverError || "حدث خطأ غير متوقع");
        },
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        registerMutation.mutate(formData);
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial" }}>
            <h2>تسجيل حساب</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label>إسم المستخدم:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>البريد الإلكتروني:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>الإسم الكامل:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>كلمة المرور:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button
                    style={{
                        padding: "10px",
                        backgroundColor: "#0070f3",
                        color: "white",
                        fontWeight: "bold",
                        border: "none",
                        cursor: "pointer",
                        width: "100%",
                    }}
                    type="submit"
                    disabled={registerMutation.isPending}
                // style={{ padding: "10px", width: "100%" }}
                >
                    {registerMutation.isPending ? "جاري التسجيل..." : "تسجيل"}
                </button>
            </form>
        </div >
    );
}