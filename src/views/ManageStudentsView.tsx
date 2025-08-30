// src/views/ManageStudentsView.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ManageStudentsView.css';
import type { ViewType } from '../types';
import type { TranslationKeys } from '../components/LanguageSwitcher';

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
  t: (key: TranslationKeys) => string;
};

const ManageStudentsView: React.FC<Props> = ({
  setView,
  setAlertMsg,
  setSelectedStudent,
  t,
}) => {
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
      setAlertMsg(t('errorLoadingStudents'));
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
      setAlertMsg(t('errorDeletingStudent'));
    } else {
      setAlertMsg(t('studentDeleted'));
      loadStudents();
    }
    setConfirmDeleteId(null); // close modal
  };
  

  return (
    <div className="manage-students-container">
      <h2>👨‍🎓 {t('manageStudents')}</h2>
      <input
        type="text"
        className="search-input"
        placeholder={t('searchByNamePhoneClass')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="manage-buttons">
  <button onClick={() => setView('admin-dashboard')}>⬅ {t('back')}</button>
  <button className="add-student-btn" onClick={() => setView('add-student')}>
    ➕ {t('addStudent')}
  </button>
</div>



      {loading ? (
        <p>{t('loading')}</p>
      ) : filtered.length === 0 ? (
        <p>{t('noStudentsFound')}</p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>{t('classLabel')}</th>
              <th>{t('phone')}</th>
              <th>{t('actions')}</th>
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
      {t('areYouSureDelete')} <strong>{
        students.find((s) => s.id === confirmDeleteId)?.name || t('thisStudent')
      }</strong>?
    </p>

      <div className="modal-buttons">
        <button className="confirm-btn" onClick={confirmDelete}>✅ {t('yes')}</button>
        <button className="cancel-btn" onClick={() => setConfirmDeleteId(null)}>❌ {t('no')}</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ManageStudentsView;