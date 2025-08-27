// src/views/ManageGradesView.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ManageView.css'; // reused for consistent styling
import type { ViewType } from '../types';

type Grade = {
  id: number;
  title: string;
  
  serie_id: number;
  display_order: number;

};

type Series = {
  id: number;
  title: string;
};

type Props = {
  setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
};

const ManageGradesView: React.FC<Props> = ({ setView, setAlertMsg }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [newGrade, setNewGrade] = useState({ title: '', serie_id: '', display_order: '' });
  const [editGradeId, setEditGradeId] = useState<number | null>(null);
  const [editGradeData, setEditGradeData] = useState<{ title: string; serie_id: number; display_order: number }>({ title: '', serie_id: 0, display_order: 0 });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchGrades();
    fetchSeries();
  }, []);

  const fetchGrades = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('grades').select('*').order('display_order');
    if (error) {
      setAlertMsg('Error loading grades');
    } else {
      setGrades(data || []);
    }
    setLoading(false);
  };

  const fetchSeries = async () => {
    const { data, error } = await supabase.from('series').select('*').order('display_order');
    if (!error && data) setSeries(data);
  };

  const handleAdd = async () => {
    if (!newGrade.title || !newGrade.serie_id || newGrade.display_order === '') {
      setAlertMsg('Please fill all fields');
      return;
    }
    const { error } = await supabase.from('grades').insert({
      title: newGrade.title,
      serie_id: Number(newGrade.serie_id),
      display_order: Number(newGrade.display_order),
    });
    if (error) {
      setAlertMsg('Error adding grade');
    } else {
      setAlertMsg('Grade added');
      setNewGrade({ title: '', serie_id: '', display_order: '' });
      fetchGrades();
    }
  };

  const handleEdit = (grade: Grade) => {
    setEditGradeId(grade.id);
    setEditGradeData({
      title: grade.title,
      serie_id: grade.serie_id,
      display_order: grade.display_order,
    });
  };

  const handleUpdate = async () => {
    if (!editGradeData.title || !editGradeData.serie_id || editGradeData.display_order === undefined) {
      setAlertMsg('Please fill all fields');
      return;
    }
    const { error } = await supabase
      .from('grades')
      .update({
        title: editGradeData.title,
        serie_id: editGradeData.serie_id,
        display_order: editGradeData.display_order,
      })
      .eq('id', editGradeId);
    if (error) {
      setAlertMsg('Error updating grade');
    } else {
      setAlertMsg('Grade updated');
      setEditGradeId(null);
      setEditGradeData({ title: '', serie_id: 0, display_order: 0 });
      fetchGrades();
    }
  };

  const requestDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId === null) return;
    const { error } = await supabase.from('grades').delete().eq('id', confirmDeleteId);
    if (error) {
      setAlertMsg('Error deleting grade');
    } else {
      setAlertMsg('Grade deleted');
      fetchGrades();
    }
    setConfirmDeleteId(null);
  };

  const filtered = grades.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-students-container">
      <h2>🏷️ Manage Grades</h2>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setView('admin-dashboard')}>⬅ Back</button>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="form-row">
        <input
          placeholder="Grade Title"
          value={newGrade.title}
          onChange={(e) => setNewGrade({ ...newGrade, title: e.target.value })}
        />
        <select
          value={newGrade.serie_id}
          onChange={(e) => setNewGrade({ ...newGrade, serie_id: e.target.value })}
        >
          <option value="">Select Series</option>
          {series.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <input
          placeholder="Order"
          type="number"
          value={newGrade.display_order}
          onChange={(e) => setNewGrade({ ...newGrade, display_order: e.target.value })}
        />
        <button onClick={handleAdd}>➕ Add</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No grades found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Series</th>
                <th>Order</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id}>
                  <td>
                    {editGradeId === g.id ? (
                      <input
                        value={editGradeData.title}
                        onChange={(e) =>
                          setEditGradeData({ ...editGradeData, title: e.target.value })
                        }
                      />
                    ) : (
                      g.title
                    )}
                  </td>
                  <td>
                    {editGradeId === g.id ? (
                      <select
                        value={editGradeData.serie_id}
                        onChange={(e) =>
                          setEditGradeData({
                            ...editGradeData,
                            serie_id: Number(e.target.value),
                          })
                        }
                      >
                        {series.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    ) : (
                      series.find((s) => s.id === g.serie_id)?.title || 'Unknown'
                    )}
                  </td>
                  <td>
                    {editGradeId === g.id ? (
                      <input
                        type="number"
                        value={editGradeData.display_order}
                        onChange={(e) =>
                          setEditGradeData({
                            ...editGradeData,
                            display_order: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      g.display_order
                    )}
                  </td>
                  <td>
                    {editGradeId === g.id ? (
                      <>
                        <button onClick={handleUpdate}>💾 Save</button>
                        <button
                          onClick={() => {
                            setEditGradeId(null);
                            setEditGradeData({ title: '', serie_id: 0, display_order: 0 });
                          }}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(g)}>✏️</button>
                        <button onClick={() => requestDelete(g.id)}>🗑️</button>
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
                {
                  grades.find((g) => g.id === confirmDeleteId)?.title ||
                  'this grade'
                }
              </strong>
              ?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmDelete}>
                ✅ Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setConfirmDeleteId(null)}
              >
                ❌ No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGradesView;
