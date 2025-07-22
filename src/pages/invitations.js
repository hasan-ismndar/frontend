import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import tableStyles from "@/styles/table.module.css";
import { api } from "@/contexts/auth_context";
import { useState } from "react";
export default function ({ initialInvitations }) {
    const [loadingId, setLoadingId] = useState(0);
    const queryClient = useQueryClient();
    const { data: invitations } = useQuery({
        queryKey: ['invitations'],
        queryFn: async () => {
            const res = await api.get('/invitations');
            return res.data.invitations;
        },
        initialData: initialInvitations,
    });
    const approveInvitationMutations = useMutation({
        mutationFn: async (id) => {
            const res = await api.post(`/invitations/${id}`);
            return res.data.message;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['invitations']);
        },
        onError: (err) => {
            console.error('فشل تحديث المشروع:', err.response?.data?.error || err.message);
        }
    })
    const rejectInvitationMutations = useMutation({
        mutationFn: async (id) => {
            const res = await api.delete(`/invitations/${id}`);
            return res.data.message;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['invitations']);
        },
        onError: (err) => {
            console.error('فشل تحديث المشروع:', err.response?.data?.error || err.message);
        }
    })
    const reject = (id) => {
        setLoadingId(id);
        rejectInvitationMutations.mutate(id);
    }
    const approve = (id) => {
        setLoadingId(id);
        approveInvitationMutations.mutate(id);
    }
    return (<>
        <Sidebar />
        <main style={{ marginLeft: "220px" }}>
            <div style={{ marginTop: '40px' }}>
                <h2 style={{ marginBottom: '20px' }}>الدعوات المتلقاة</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f0f0f0' }}>
                                <th className={tableStyles.header}>الداعي</th>
                                <th className={tableStyles.header}>اسم المشروع</th>
                                <th className={tableStyles.header}>الإجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invitations.map((inv) => (
                                <tr key={inv.id}>
                                    <td className={tableStyles.cell}>{inv.inviter || 'غير معروف'}</td>
                                    <td className={tableStyles.cell}>{inv.projectTitle || 'مشروع غير معرف'}</td>
                                    <td className={tableStyles.cell}>
                                        <button
                                            onClick={() => approve(inv.id)}
                                            // disabled={loadingId === inv.id}
                                            className={tableStyles.btnStyle}
                                            style={{ backgroundColor: '#28a745' }}
                                        >
                                            {loadingId === inv.id ? '...' : 'قبول'}
                                        </button>
                                        <button
                                            onClick={() => reject(inv.id)}
                                            // disabled={loadingId === inv.id}
                                            className={tableStyles.btnStyle}
                                            style={{ backgroundColor: '#dc3545', marginRight: '10px' }}
                                        >
                                            {loadingId === inv.id ? '...' : 'رفض'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {invitations.length === 0 && (
                                <tr>
                                    <td className={tableStyles.cell} colSpan="3">لا توجد دعوات حالياً.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </>)
}


export async function getServerSideProps({ req }) {
    const cookie = req.headers.cookie || '';

    try {
        const res = await fetch('http://localhost:8000/invitations', {
            headers: { cookie },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        return {
            props: {
                initialInvitations: data.invitations || [],
            },
        };
    } catch (err) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
}
