import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import tableStyles from "@/styles/table.module.css";
import { useState } from "react";
import InvitationForm from "@/components/forms/InvitationForm"
import Modal from "@/components/Modal";
import { api } from "@/contexts/auth_context";
export default function Members({ initialInvitations, initialProject }) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    const queryClient = useQueryClient();
    const { id: projectId } = router.query;
    const { data: project } = useQuery({
        queryKey: ['members', projectId],
        queryFn: async () => {
            const res = await api.get(`/projects/${projectId}/members`);
            return res.data.project;
        },
        initialData: initialProject,
    });
    const { data: invitations } = useQuery({
        queryKey: ['invitations', projectId],
        queryFn: async () => {
            const res = await api.get(`/projects/${projectId}/invitations`);
            console.log(res);
            return res.data.invitations;
        },
        initialData: initialInvitations,
    });
    const sendInvitationMutations = useMutation({
        mutationFn: async (username) => {
            const res = await api.post(`/projects/${projectId}/invitations`, { username });
            return res.data.task;
        },
        onSuccess: () => {
            setShowModal(false);
            queryClient.invalidateQueries(['invitations', projectId]);
        },

        onError: (err) => {
            setError(err.response?.data?.error || "حدث خطأ");
        }
    })
    const sendInvitation = (username) => {
        sendInvitationMutations.mutate(username)
        // setShowModal(false);
    }
    return (
        <>
            <Sidebar />
            <Header title={project.title} />
            <main style={{ marginLeft: '220px' }}>
                <div className={tableStyles.container} >
                    <h2>قائمة الأعضاء</h2>
                    <div className={tableStyles.tableContainer}>
                        <table className={tableStyles.table}>
                            <thead>
                                <tr>
                                    <th className={tableStyles.header}>الاسم</th>
                                    <th className={tableStyles.header}>الدور</th>
                                </tr>
                            </thead>
                            <tbody>
                                {project.users.map(member => (
                                    <tr key={member.id}>
                                        <td className={tableStyles.cell}>{member.username}</td>
                                        <td className={tableStyles.cell}>
                                            {member.role === 'owner' ? 'مدير المشروع' : 'عضو'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px' }}>
                        <h2 className={tableStyles.title}>قائمة الدعوات</h2>
                        <button className={tableStyles.inviteButton} onClick={() => setShowModal(true)}>
                            + دعوة مستخدم
                        </button>
                    </div>
                    <div className={tableStyles.tableContainer}>
                        <table className={tableStyles.table}>
                            <thead>
                                <tr>
                                    <th className={tableStyles.header}>الاسم</th>
                                    <th className={tableStyles.header}>الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitations.map(inv => (
                                    <tr key={inv.id}>
                                        <td className={tableStyles.cell}>{inv.inviteeName}</td>
                                        <td className={tableStyles.cell}>{inv.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <InvitationForm onSubmit={sendInvitation} />
                    {error && (
                        <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}
                </Modal>
            </main>

        </>)
}
export async function getServerSideProps({ req, params }) {
    const cookie = req.headers.cookie || '';
    const projectId = params.id;

    try {
        const [membersRes, invitationsRes] = await Promise.all([
            fetch(`http://localhost:8000/projects/${projectId}/members`, {
                headers: { cookie },
            }),
            fetch(`http://localhost:8000/projects/${projectId}/invitations`, {
                headers: { cookie },
            }),
        ]);

        if (!invitationsRes.ok || !membersRes.ok) throw new Error();

        const membersData = await membersRes.json();
        const invitationsData = await invitationsRes.json();

        return {
            props: {
                initialProject: membersData.project ?? {},           // ✅
                initialInvitations: invitationsData.invitations ?? [] // ✅
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