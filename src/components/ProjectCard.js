import styles from '../styles/components/ProjectCard.module.css';
import Link from 'next/link';

export default function ProjectCard({ project, onEdit, onDelete, role }) {
  console.log(role);
  const endDate = new Date(project.endDate)
  const dateOnly = new Date(endDate).toLocaleDateString('en-CA');
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{project.title}</h3>
        <span className={`${styles.status} ${project.status === 'completed' ? styles.completed : styles.active}`}>
          {project.status}
        </span>
      </div>

      <p className={styles.details}>
        عدد المهام: {project.taskCount} <br />
        الموعد النهائي: {dateOnly}
      </p>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Link href={`/projects/${project.id}`} className={styles.button}>عرض</Link>
        <button
          disabled={!(role == 'owner')}
          className={styles.button}
          onClick={onEdit}
          style={{ backgroundColor: '#ffa502' }}>
          تعديل
        </button>
        <button
          disabled={!(role == 'owner')}
          className={styles.button}
          onClick={onDelete}
          style={{ backgroundColor: '#e74c3c' }}>
          حذف
        </button>
      </div>
    </div>
  );
}
