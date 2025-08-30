import { useState } from 'react';
import styles from '../../styles/forms/TaskForm.module.css';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/contexts/auth_context';
export default function TaskForm({ onSubmit, initialData = {} }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [assignee, setAssignee] = useState(initialData?.assignee?.username || '');
  const [endDate, setendDate] = useState(initialData?.endDate || '');
  const [priority, setPriority] = useState(initialData?.priority || 'متوسطة');
  const [status, setStatus] = useState(initialData?.status || 'جاري');
  const [description, setDescription] = useState(initialData?.description || '');
  const router = useRouter();
  const { id: projectId } = router.query;

  const { data: members, isSuccess, isLoading } = useQuery({
    queryKey: ['projects', projectId, 'members'],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}/members`);
      return res.data.project.users;
    },
  });
  console.log(assignee);
  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      id: initialData?.id || 0,
      title,
      assignee,
      endDate,
      priority,
      status,
      description,
    };
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
      <select
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        required
      >
        <option value="">-- اختر المسؤول --</option>
        {isLoading && <option disabled>جارِ التحميل...</option>}
        {isSuccess && members.map((member) => (
          <option key={member.username} value={member.username}>
            {member.username}
          </option>
        ))}
      </select>

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
