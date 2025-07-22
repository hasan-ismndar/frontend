import { useState } from 'react';
import styles from '../../styles/forms/ProjectForm.module.css';

export default function ProjectForm({ onSubmit, initialData = {} }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [status, setStatus] = useState(initialData?.status || 'نشط');

  const handleSubmit = (e) => {
    e.preventDefault();

    const projectData = {
      id: initialData.id || 0,
      title,
      description,
      endDate,
      status,
    };
    onSubmit?.(projectData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>{initialData.id ? 'تعديل مشروع' : 'إضافة مشروع جديد'}</h3>


      <label>اسم المشروع:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>وصف المشروع:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>تاريخ الانتهاء:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />

      <label>الحالة:</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="نشط">نشط</option>
        <option value="مكتمل">مكتمل</option>
      </select>

      <button type="submit">حفظ المشروع</button>
    </form>
  );
}
