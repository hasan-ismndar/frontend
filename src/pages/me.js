import React from 'react';

export default function MePage({ user }) {
    console.log(user);
    return (
        <div>
            <h1>مرحباً {user.username || user.email}</h1>
            <p>هذه صفحة محمية لا يمكن الوصول إليها إلا بعد تسجيل الدخول.</p>
        </div>
    );
}

export async function getServerSideProps({ req }) {
    const cookie = req.headers.cookie || '';

    const res = await fetch('http://localhost:8000/me', {
        headers: { cookie },
    });

    if (!res.ok) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const data = await res.json();

    return {
        props: { user: data.user },
    };
}
