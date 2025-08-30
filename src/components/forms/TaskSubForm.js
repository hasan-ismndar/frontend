import { useState } from 'react';
import styles from '../../styles/forms/TaskForm.module.css';
export default function TaskSubForm({ onSubmit, initialData = {} }) {
    const [status, setStatus] = useState(initialData?.status || 'جاري');
    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            id: initialData.id || 0,
            assignee: initialData.assignee.username,
            title: initialData.title,
            priority: initialData.priority,
            description: initialData.description,
            endDate: initialData.endDate,
            status,

        };
        console.log(taskData);
        onSubmit?.(taskData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>{initialData?.id ? 'تعديل مهمة' : 'إضافة مهمة جديدة'}</h3>

            <label>الحالة:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="جاري">جاري</option>
                <option value="مكتملة">مكتملة</option>
            </select>

            <button type="submit">حفظ المهمة</button>
        </form>
    );
}
