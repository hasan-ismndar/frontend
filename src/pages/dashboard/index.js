import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth_context';
export default function DashboardPage({ data }) {
  const { user } = useAuth();
  const taskStatusData = [
    { name: 'جارية', value: data.tasks.active },
    { name: 'مكتملة', value: data.tasks.completed },
  ];

  const COLORS = ['#0070f3', '#00b894'];

  const projectBarData = [
    { name: 'مشاريع نشطة', value: data.projects.active },
    { name: 'مشاريع مكتملة', value: data.projects.completed },
  ];
  const myTaskStatusData = [
    { name: 'جارية', value: data.myTasks.active },
    { name: 'مكتملة', value: data.myTasks.completed },
  ];

  return (
    <>
      <Sidebar />
      <Header title="الملف الشخصي" />

      <main style={{ marginLeft: '220px', padding: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>الإحصائيات</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
          {/* مخطط دائري لحالة المهام */}
          <div style={{ width: '300px', height: '300px' }}>
            <h4 style={{ textAlign: 'center' }}>حالة المهام</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ width: '300px', height: '300px' }}>
            <h4 style={{ textAlign: 'center' }}>حالة مهامي</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={myTaskStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* مخطط أعمدة للمشاريع */}
          <div style={{ width: '400px', height: '300px' }}>
            <h4 style={{ textAlign: 'center' }}>المشاريع</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectBarData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1e1e2f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <h2 style={{ fontSize: "30px", marginBottom: "15px", marginTop: "30px" }}>
          المعلومات الشخصية
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            padding: "20px",
            borderRadius: "12px",
            fontFamily: "sans-serif",
          }}
        >


          <div style={{ marginBottom: "10px" }}>
            <strong>اسم المستخدم:</strong> {user?.username}
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>الاسم الكامل:</strong> {user?.fullName}
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>البريد الإلكتروني:</strong> {user?.email}
          </div>

          <div style={{ marginTop: "15px" }}>
            <Link
              href={"/reset-password"}
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              تغيير كلمة المرور
            </Link>
          </div>
        </div>

      </main>

    </>

  );
}
export async function getServerSideProps({ req }) {
  const cookie = req.headers.cookie || '';
  try {
    const res = await fetch(`http://localhost:8000/dashboard`, { headers: { cookie }, });
    if (!res.ok) throw new Error();

    const projectData = await res.json();
    return {
      props: {
        data: projectData.data,
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

