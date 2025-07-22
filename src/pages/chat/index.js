import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ChatBox from '@/components/ChatBox';
import { io } from 'socket.io-client';
import { useAuth } from '@/contexts/auth_context';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/chat.module.css';
export default function ChatPage({ projects }) {

  return (
    <>
      <Sidebar />
      <Header title="المحادثات المتاحة" />
      <main style={{ marginLeft: '220px', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '40px', }}>
        {
          projects.map((project) => {
            return (
              <div key={project.id} className={styles.chatBoxPreview}>
                <div className={styles.projectName}>{project.title}</div>
                <Link className={styles.chatLink} href={`chat/${project.id}`} >دخول إلى الدردشة</Link>
              </div>
            )
          })
        }

        {/* <ChatBox socket={socket} /> */}
      </main>
    </>
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
        projects: data.projects,
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

