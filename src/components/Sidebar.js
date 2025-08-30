import styles from '../styles/layout/Sidebar.module.css';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth_context';
export default function Sidebar() {
  const { logout } = useAuth();
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>TaskManager</h2>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}><Link href="/projects">المشاريع</Link></li>
          <li className={styles.navItem}><Link href="/chat">الدردشة</Link></li>
          <li className={styles.navItem}><Link href="/calendar">التقويم</Link></li>
          <li className={styles.navItem}><Link href="/invitations">الدعوات</Link></li>
          <li className={styles.navItem}><Link href="/dashboard">الملف الشخصي </Link></li>

          <li className={styles.navItem} onClick={logout} style={{ cursor: 'pointer' }}>تسجيل الخروج</li>

        </ul>
      </nav>
    </div>
  );
}
