import { useState } from 'react';
import styles from '../../styles/forms/ProjectForm.module.css';

export default function ProjectForm({ onSubmit }) {
    const [username, setUsername] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(username);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>

            <label>اسم المستخدم:</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <button type="submit">إرسال</button>
        </form>
    );
}
