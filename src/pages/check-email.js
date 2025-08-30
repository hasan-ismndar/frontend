import Link from "next/link";

export default function CheckEmail() {
    return (
        <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center", fontFamily: "Arial" }}>
            <h2>📧 تحقق من بريدك الإلكتروني</h2>
            <p>لقد أرسلنا إليك رسالة تحتوي على رابط تفعيل حسابك.</p>
            <p>إذا لم تجد الرسالة، يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam).</p>
            <p>يمكنك تسجيل الدخول بعد تفعيل حسابك.</p>
            <Link href={'/resend-confirmation'}>إعادة إرسال الرمز</Link>
        </div>
    );
}