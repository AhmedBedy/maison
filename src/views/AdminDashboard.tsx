import React from 'react';
import type { ViewType } from '../types';

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
        <button onClick={() => setView('manage-series')}>📚 Manage Series</button>
        <button onClick={() => setView('manage-grades')}>🏷️ Manage Grades</button>
        <button onClick={() => setView('manage-subjects')}>📘 Manage Subjects</button>
        <button onClick={() => setView('manage-courses')}>📝 Manage Courses</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
