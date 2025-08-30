import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import ProjectForm from '@/components/forms/ProjectForm';
import Modal from '@/components/Modal';
import { api } from '@/contexts/auth_context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
export default function Projects({ initialProjects }) {
  const queryClient = useQueryClient();

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data.projects;
    },
    initialData: initialProjects,
  });

  const [showModal, setShowModal] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState('');
  const addProjectMutation = useMutation({
    mutationFn: async (data) => {
      const { id, ...project } = data;
      const res = await api.post('/projects', project);
      return res.data.project;
    },
    onSuccess: () => {
      setShowModal(false);
      setSelectedProject(null);
      setIsSelected(false);
      queryClient.invalidateQueries(['projects']);
    },
    onError: (err) => {
      setError(err.response?.data?.error || "حدث خطأ");

    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId) => api.delete(`/projects/${projectId}`),

    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries(['projects']);

    },
    onError: (err) => {
      setError(err.response?.data?.error || "حدث خطأ");

    },
  })
  const editProjectMutation = useMutation({
    mutationFn: async (data) => {
      const { id, ...project } = data;
      const res = await api.put(`/projects/${id}`, project);
      return res.data.project;
    },
    onSuccess: (updatedProject) => {
      setShowModal(false);
      queryClient.invalidateQueries(['projects']);
      queryClient.setQueryData(['project', updatedProject.id], updatedProject);
    },

    onError: (err) => {
      setError(err.response?.data?.error || "حدث خطأ");
    },
  })
  const addProject = (projectData) => {
    setError('');
    addProjectMutation.mutate(projectData);
  }
  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm('هل أنت متأكد من حذف المشروع؟');
    if (!confirmDelete) return;
    deleteProjectMutation.mutate(projectId);
  };
  const onUserUpdate = (project) => {
    setSelectedProject(project);
    setIsSelected(true);
  }
  const editProject = (data) => {
    setError('');
    editProjectMutation.mutate(data);

  }


  return (
    <div>
      <Sidebar />
      <Header title="قائمة المشاريع" />
      <main style={{ marginLeft: '220px', padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2>المشاريع الحالية</h2>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
            + إضافة مشروع
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              role={project.role}
              onEdit={() => onUserUpdate(project)}
              onDelete={() => deleteProject(project.id)}
            />
          ))}
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ProjectForm onSubmit={addProject} />
          {error && (
            <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
              {error}
            </p>
          )}
        </Modal>

        <Modal isOpen={isSelected} onClose={() => setIsSelected(false)}>
          <ProjectForm
            initialData={selectedProject}
            onSubmit={editProject}
          />
          {error && (
            <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
              {error}
            </p>
          )}
        </Modal>
      </main>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const cookie = req.headers.cookie || '';

  try {
    const res = await fetch('http://localhost:8000/projects', {
      headers: { cookie },
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    return {
      props: {
        initialProjects: data.projects,
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
