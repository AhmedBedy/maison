// src/views/ManageStudentsView.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type Student = {
  id: number;
  name: string;
  phone: string;
  class: string;
};

type Props = {
  setView: (view: string) => void;
  setAlertMsg: (msg: string) => void;
};

const ManageStudentsView: React.FC<Props> = ({ setView, setAlertMsg }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
      setAlertMsg('Error loading students');
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>👨‍🎓 Manage Students</h2>

      <button onClick={() => setView('admin-dashboard')}>⬅ Back to Dashboard</button>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.phone}</td>
                <td>{s.class}</td>
                <td>
                  <button onClick={() => alert('Edit not yet implemented')}>✏️ Edit</button>
                  <button onClick={() => alert('Delete not yet implemented')}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageStudentsView;
