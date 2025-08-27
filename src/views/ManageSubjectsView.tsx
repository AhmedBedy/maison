import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ManageView.css';
import type { ViewType } from '../types';


type Subject = {
  id: number;
  title: string;
  icon: string;
  display_order: number;
};

type Props = {
    setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
};

const ManageSubjectsView: React.FC<Props> = ({ setView, setAlertMsg }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [newSubject, setNewSubject] = useState({ title: '', icon: '', display_order: '' });
  const [editSubjectId, setEditSubjectId] = useState<number | null>(null);
  const [editSubjectData, setEditSubjectData] = useState({ title: '', icon: '', display_order: 0 });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('display_order');
    if (error) {
      setAlertMsg('Error loading subjects');
    } else {
      setSubjects(data || []);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newSubject.title || !newSubject.icon || newSubject.display_order === '') {
      setAlertMsg('Please fill all fields');
      return;
    }
    const { error } = await supabase.from('subjects').insert({
      title: newSubject.title,
      icon: newSubject.icon,
      display_order: Number(newSubject.display_order),
    });
    if (error) {
      setAlertMsg('Error adding subject');
    } else {
      setAlertMsg('Subject added');
      setNewSubject({ title: '', icon: '', display_order: '' });
      fetchSubjects();
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditSubjectId(subject.id);
    setEditSubjectData({
      title: subject.title,
      icon: subject.icon,
      display_order: subject.display_order,
    });
  };

  const handleUpdate = async () => {
    if (!editSubjectData.title || !editSubjectData.icon || editSubjectData.display_order === undefined) {
      setAlertMsg('Please fill all fields');
      return;
    }
    const { error } = await supabase
      .from('subjects')
      .update({
        title: editSubjectData.title,
        icon: editSubjectData.icon,
        display_order: editSubjectData.display_order,
      })
      .eq('id', editSubjectId);
    if (error) {
      setAlertMsg('Error updating subject');
    } else {
      setAlertMsg('Subject updated');
      setEditSubjectId(null);
      setEditSubjectData({ title: '', icon: '', display_order: 0 });
      fetchSubjects();
    }
  };

  const requestDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId === null) return;
    const { error } = await supabase.from('subjects').delete().eq('id', confirmDeleteId);
    if (error) {
      setAlertMsg('Error deleting subject');
    } else {
      setAlertMsg('Subject deleted');
      fetchSubjects();
    }
    setConfirmDeleteId(null);
  };

  const filtered = subjects.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-students-container">
      <h2>📘 Manage Subjects</h2>

      <div className="back-row">
        <button onClick={() => setView('admin-dashboard')}>⬅ Back</button>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search by title or icon"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="add-form">
        <input
          placeholder="Title"
          value={newSubject.title}
          onChange={(e) => setNewSubject({ ...newSubject, title: e.target.value })}
        />
        <input
          placeholder="Icon"
          value={newSubject.icon}
          onChange={(e) => setNewSubject({ ...newSubject, icon: e.target.value })}
        />
        <input
          placeholder="Order"
          type="number"
          value={newSubject.display_order}
          onChange={(e) => setNewSubject({ ...newSubject, display_order: e.target.value })}
        />
        <button onClick={handleAdd}>➕ Add</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No subjects found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Icon</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    {editSubjectId === s.id ? (
                      <input
                        value={editSubjectData.title}
                        onChange={(e) =>
                          setEditSubjectData({ ...editSubjectData, title: e.target.value })
                        }
                      />
                    ) : (
                      s.title
                    )}
                  </td>
                  <td>
                    {editSubjectId === s.id ? (
                      <input
                        value={editSubjectData.icon}
                        onChange={(e) =>
                          setEditSubjectData({ ...editSubjectData, icon: e.target.value })
                        }
                      />
                    ) : (
                      s.icon
                    )}
                  </td>
                  <td>
                    {editSubjectId === s.id ? (
                      <input
                        type="number"
                        value={editSubjectData.display_order}
                        onChange={(e) =>
                          setEditSubjectData({
                            ...editSubjectData,
                            display_order: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      s.display_order
                    )}
                  </td>
                  <td>
  {editSubjectId === s.id ? (
    <>
      <button onClick={handleUpdate}>💾 Save</button>
      <button
        onClick={() => {
          setEditSubjectId(null);
          setEditSubjectData({ title: '', icon: '', display_order: 0 });
        }}
      >
        ❌ Cancel
      </button>
    </>
  ) : (
    <>
      <button onClick={() => handleEdit(s)}>✏️</button>
      <button onClick={() => requestDelete(s.id)}>🗑️</button>
    </>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <p>
              Are you sure you want to delete{' '}
              <strong>
                {subjects.find((s) => s.id === confirmDeleteId)?.title || 'this subject'}
              </strong>
              ?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmDelete}>
                ✅ Yes
              </button>
              <button className="cancel-btn" onClick={() => setConfirmDeleteId(null)}>
                ❌ No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubjectsView;
