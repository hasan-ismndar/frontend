import styles from '../styles/components/TaskCard.module.css';
import Link from 'next/link';

export default function TaskCard({ task, onClick, onEdit, onDelete, permissions }) {
  const endDate = new Date(task.endDate)
  const dateOnly = new Date(endDate).toLocaleDateString('en-CA');
  return (

    <div className={styles.card}
      onClick={() => onClick?.(task)}
    >
      <div className={styles.header}>
        <h3>{task.title}</h3>
        <span className={`${styles.status} ${task.status === 'مكتملة' ? styles.completed : styles.inProgress}`}>
          {task.status}
        </span>
      </div>

      <p className={styles.meta}>
        <strong>المسؤول:</strong> {task.assignee.username}<br />
        <strong>الموعد:</strong> {dateOnly}<br />
        <strong>الأولوية:</strong> {task.priority}<br />
      </p>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          disabled={!(task.role == 'owner' || task.allowed)}
          className={styles.button}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          style={{
            backgroundColor: '#ffa502'
          }}>
          تعديل
        </button>
        <button
          disabled={!(task.role == 'owner')}
          className={styles.button}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          style={{
            backgroundColor: '#e74c3c'
          }}>
          حذف
        </button>
      </div>
    </div>
  );
}
