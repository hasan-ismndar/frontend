import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/forms/TaskForm';
import Modal from '@/components/Modal';
import { api } from '@/contexts/auth_context';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
export default function ProjectDetailsPage({ initialProject, initialTasks }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { id: projectId } = router.query;
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isSelected, setisSelected] = useState(false);
    const [viewTask, setViewTask] = useState(null);
    const [error, setError] = useState('');
    const { data: project } = useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const res = await api.get(`/projects/${projectId}`);
            return res.data.project;
        },
        initialData: initialProject,
    });
    const { data: tasks } = useQuery({
        queryKey: ['tasks', projectId],
        queryFn: async () => {
            const res = await api.get(`/projects/${projectId}/tasks`);
            return res.data.tasks;
        },
        initialData: initialTasks
    });
    const addTaskMutation = useMutation({
        mutationFn: async (data) => {
            const { id, ...task } = data;
            const res = await api.post(`/projects/${projectId}/tasks`, task);
            return res.data.task;
        },
        onSuccess: () => {
            setShowModal(false);
            queryClient.invalidateQueries(['tasks', projectId]);
        },

        onError: (err) => {
            setError(err.response?.data?.error || "حدث خطأ");

        }
    });
    const editTaskMutation = useMutation({
        mutationFn: async (data) => {
            const { id, ...task } = data;
            const res = await api.put(`/projects/${projectId}/tasks/${id}`, task);
            return res.data.task;
        },
        onSuccess: () => {
            setShowModal(false);
            setisSelected(false);
            setSelectedTask(null);
            queryClient.invalidateQueries(['tasks', projectId]);
        },
        onError: (err) => {
            setError(err.response?.data?.error || "حدث خطأ");
        }
    });
    const deleteTaskMutation = useMutation({
        mutationFn: async (id) => {
            const res = await api.delete(`/projects/${projectId}/tasks/${id}`);
            return res.data.task;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks', projectId]);
        },
        onError: (err) => {
            console.error('فشل تحديث المشروع:', err.response?.data?.error || err.message);
        }
    });

    const addTask = (task) => {
        setError('');
        addTaskMutation.mutate(task);
    };
    const editTask = (data) => {
        setError('');
        editTaskMutation.mutate(data);

    };
    const deleteTask = async (taskId) => {
        const confirmDelete = window.confirm('هل أنت متأكد من حذف المشروع؟');
        if (!confirmDelete) return;
        deleteTaskMutation.mutate(taskId);
    };
    const onEditTask = (task) => {
        setisSelected(true);
        setSelectedTask(task);
    };
    return (
        <>
            <Sidebar />
            <Header title={project.title} />
            <main style={{ marginLeft: '220px', padding: '20px' }}>
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '10px' }}>{project.title}</h2>
                    <p style={{ color: '#666' }}>{project.description}</p>
                </section>
                <section style={{ marginBottom: '30px' }}>
                    {
                        project.permissions.includes('manage_members') &&
                        <Link href={`/projects/${project.id}/members`} style={{ color: 'blue' }}>إدارة الأعضاء</Link>}
                </section>
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>قائمة المهام</h3>
                        <button
                            disabled={!project.permissions.includes('create_task')}
                            onClick={() => setShowModal(true)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#0070f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}>
                            + إضافة مهمة
                        </button>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        {tasks.map((task) => (
                            <TaskCard
                                permissions={task.permissions}
                                key={task.id}
                                task={task}
                                onEdit={onEditTask}
                                onDelete={deleteTask}
                                onClick={setViewTask} />
                        ))}
                    </div>
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                        {error && (
                            <p style={{ color: 'red', marginBottom: '2px', textAlign: 'center' }}>
                                {error}
                            </p>
                        )}
                        <TaskForm onSubmit={addTask} />

                    </Modal>
                    <Modal isOpen={isSelected} onClose={() => setisSelected(false)}>
                        <TaskForm initialData={selectedTask} onSubmit={editTask} />
                        {error && (
                            <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                                {error}
                            </p>
                        )}
                    </Modal>
                    <Modal isOpen={!!viewTask} onClose={() => setViewTask(null)}>
                        {viewTask && (
                            <div>
                                <h3>تفاصيل المهمة</h3>
                                <p><strong>العنوان:</strong> {viewTask.title}</p>
                                <p><strong>الوصف:</strong> {viewTask.description || 'لا يوجد وصف'}</p>
                                <p><strong>الموعد:</strong> {viewTask.endDate}</p>
                                <p><strong>المسؤول:</strong> {viewTask.assignee.username}</p>
                                <p><strong>الأولوية:</strong> {viewTask.priority}</p>
                                <p><strong>الحالة:</strong> {viewTask.status}</p>
                            </div>
                        )}
                    </Modal>
                </section>
            </main>
            {/* <section>
        
       
        
      
       
      

      </section>
    </main > */}
        </>
    );
}

export async function getServerSideProps({ req, params }) {
    const cookie = req.headers.cookie || '';
    const projectId = params.id;
    try {
        const [projectRes, tasksRes] = await Promise.all(
            [
                fetch(`http://localhost:8000/projects/${projectId}`, {
                    headers: { cookie },
                }),
                fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
                    headers: { cookie },
                }),
            ]
        )

        if (!projectRes.ok || !tasksRes.ok) throw new Error();

        const projectData = await projectRes.json();
        const tasksData = await tasksRes.json();
        return {
            props: {
                initialProject: projectData.project,
                initialTasks: tasksData.tasks
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
