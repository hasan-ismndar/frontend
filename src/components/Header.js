import styles from '../styles/layout/Header.module.css';

export default function Header({ title = "لوحة التحكم" }) {
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
    </header>
  );
}
