// src/views/ManageStudentsView.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ManageStudentsView.css';
import type { ViewType } from '../types';

type Student = {
  id: number;
  name: string;
  phone: number;
  class: string;
  password: number;
};


type Props = {
  setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
  setSelectedStudent: (student: Student) => void;
};

const ManageStudentsView: React.FC<Props> = ({ setView, setAlertMsg, setSelectedStudent }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
// inside ManageStudentsView component
const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

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

  const filtered = students.filter((s) =>
  [s.name, s.phone.toString(), s.class].some((field) =>
  field.toLowerCase().includes(search.toLowerCase())
)
  );

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setView('edit-student');
  };

  const requestDelete = (id: number) => {
    setConfirmDeleteId(id); // show modal
  };
  
  const confirmDelete = async () => {
    if (confirmDeleteId === null) return;
  
    const { error } = await supabase.from('students').delete().eq('id', confirmDeleteId);
    if (error) {
      setAlertMsg('Error deleting student');
    } else {
      setAlertMsg('Student deleted');
      loadStudents();
    }
    setConfirmDeleteId(null); // close modal
  };
  

  return (
    <div className="manage-students-container">
      <h2>👨‍🎓 Manage Students</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Search by name, phone or class"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="manage-buttons">
  <button onClick={() => setView('admin-dashboard')}>⬅ Back</button>
  <button className="add-student-btn" onClick={() => setView('add-student')}>
    ➕ Add New Student
  </button>
</div>



      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.class}</td>
                <td>{s.phone}</td>
                <td>
                  <button onClick={() => handleEdit(s)}>✏️</button>
                  <button onClick={() => requestDelete(s.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

{confirmDeleteId !== null && (
  <div className="modal-overlay">
    <div className="modal">
    <p>
  Are you sure you want to delete{' '}
  <strong>
    {
      students.find((s) => s.id === confirmDeleteId)?.name || 'this student'
    }
  </strong>
  ?
</p>

      <div className="modal-buttons">
        <button className="confirm-btn" onClick={confirmDelete}>✅ Yes</button>
        <button className="cancel-btn" onClick={() => setConfirmDeleteId(null)}>❌ No</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ManageStudentsView;
