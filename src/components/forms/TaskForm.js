import { useState } from 'react';
import styles from '../../styles/forms/TaskForm.module.css';


export default function TaskForm({ onSubmit, initialData = {} }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [assignee, setAssignee] = useState(initialData?.assignee?.username || '');
  const [endDate, setendDate] = useState(initialData?.endDate || '');
  const [priority, setPriority] = useState(initialData?.priority || 'متوسطة');
  const [status, setStatus] = useState(initialData?.status || 'جاري');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hello", priority);
    const taskData = {
      id: initialData?.id || 0,
      title,
      assignee,
      endDate,
      priority,
      status,
      description,
    };

    // console.log('✅ حفظ المهمة:', taskData);
    onSubmit?.(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>{initialData?.id ? 'تعديل مهمة' : 'إضافة مهمة جديدة'}</h3>
      <label>عنوان المهمة:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>المسؤول:</label>
      <input
        type="text"
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        required
      />

      <label>تاريخ الانتهاء:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setendDate(e.target.value)}
        required
      />

      <label>الأولوية:</label>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="عالية">عالية</option>
        <option value="متوسطة">متوسطة</option>
        <option value="منخفضة">منخفضة</option>
      </select>

      <label>الحالة:</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="جاري">جاري</option>
        <option value="مكتملة">مكتملة</option>
      </select>

      <label>الوصف:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <button type="submit">حفظ المهمة</button>
    </form>
  );
}
