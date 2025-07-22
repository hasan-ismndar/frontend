import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const Calendar = dynamic(() => import('react-calendar'), { ssr: false });

import 'react-calendar/dist/Calendar.css';

export default function CalendarPage({ tasks, projects }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const tasksForDate = tasks.filter(task => ((new Date(task.endDate)).toISOString().split('T')[0]) === selectedDateStr);
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : 'مشروع غير معروف';
  };

  return (
    <>
      <Sidebar />
      <Header title="تقويم المهام" />
      <main style={{ marginLeft: '220px', padding: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>حدد يومًا لعرض المهام</h2>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            locale="ar"
          />
          <div style={{
            flex: 1,
            minWidth: '350px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '15px' }}>
              مهام يوم {selectedDate.toLocaleDateString('ar-EG')}
            </h3>
            {tasksForDate.length === 0 ? (
              <p>لا توجد مهام مجدولة لهذا اليوم.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {tasksForDate.map(task => (
                  <li key={task.id} style={{
                    marginBottom: '15px',
                    padding: '10px',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <strong>📝 {task.title}</strong><br />
                    <small>📌 المشروع: {getProjectName(task.projectId)}</small><br />
                    {/* <small>👤 المسؤول: {task.assignee}</small><br /> */}
                    <small>⚙️ الحالة: {task.status}</small><br />
                    <small>⏰ الموعد: {(new Date(task.endDate)).toISOString().split('T')[0]}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const cookie = req.headers.cookie || '';
  try {
    const [projectRes, tasksRes] = await Promise.all(
      [
        fetch(`http://localhost:8000/projects`, {
          headers: { cookie },
        }),
        fetch(`http://localhost:8000/projects/tasks`, {
          headers: { cookie },
        }),
      ]
    )

    // if (!projectRes.ok || !tasksRes.ok) throw new Error();
    if (!tasksRes.ok) {
      throw new Error("hello");
    }

    const projectData = await projectRes.json();
    const tasksData = await tasksRes.json();
    return {
      props: {
        projects: projectData.projects,
        tasks: tasksData.tasks
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
