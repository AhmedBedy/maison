import React from 'react';
import type { ViewType } from '../types'


type AdminDashboardProps = {
  isAdminLogin: boolean;
  setAlertMsg: (view: string) => void;
  setView: (view: ViewType) => void;
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isAdminLogin,
  setAlertMsg,
  setView
}) => {
  if (!isAdminLogin) {
    setAlertMsg('Access denied. Please login as admin.');
    setView('admin');
    return null;
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
      <button onClick={() => setView('manage-students')}>👨‍🎓 Manage Students</button>

 <button onClick={() => alert('Manage Series')}>📚 Manage Series</button>
        <button onClick={() => alert('Manage Grades')}>🏷️ Manage Grades</button>
        <button onClick={() => alert('Manage Subjects')}>📘 Manage Subjects</button>
        <button onClick={() => alert('Manage Courses')}>📝 Manage Courses</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
