import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ManageView.css';
import type { ViewType } from '../types';

type Series = {
  id: number;
  title: string;
  icon: string;
};

type Props = {
  setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
};

const ManageSeriesView: React.FC<Props> = ({ setView, setAlertMsg }) => {
  const [series, setSeries] = useState<Series[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [newSeries, setNewSeries] = useState({ title: '', icon: '' });
  const [editSeriesId, setEditSeriesId] = useState<number | null>(null);
  const [editSeriesData, setEditSeriesData] = useState({ title: '', icon: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('series').select('*');
    if (error) {
      setAlertMsg('Error loading series');
    } else {
      setSeries(data || []);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newSeries.title || !newSeries.icon) {
      setAlertMsg('Please fill all fields');
      return;
    }
    const { error } = await supabase.from('series').insert([newSeries]);
    if (error) {
      setAlertMsg('Error adding series');
    } else {
      setAlertMsg('Series added');
      setNewSeries({ title: '', icon: '' });
      fetchSeries();
    }
  };

  const handleEdit = (serie: Series) => {
    setEditSeriesId(serie.id);
    setEditSeriesData({ title: serie.title, icon: serie.icon });
  };

  const handleUpdate = async () => {
    if (!editSeriesData.title || !editSeriesData.icon) {
      setAlertMsg('Please fill all fields');
      return;
    }
    const { error } = await supabase
      .from('series')
      .update(editSeriesData)
      .eq('id', editSeriesId);
    if (error) {
      setAlertMsg('Error updating series');
    } else {
      setAlertMsg('Series updated');
      setEditSeriesId(null);
      fetchSeries();
    }
  };

  const requestDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId === null) return;
    const { error } = await supabase.from('series').delete().eq('id', confirmDeleteId);
    if (error) {
      setAlertMsg('Error deleting series');
    } else {
      setAlertMsg('Series deleted');
      fetchSeries();
    }
    setConfirmDeleteId(null);
  };

  const filtered = series.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-students-container">
      <h2>📚 Manage Series</h2>

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
          value={newSeries.title}
          onChange={(e) => setNewSeries({ ...newSeries, title: e.target.value })}
        />
        <input
          placeholder="Icon"
          value={newSeries.icon}
          onChange={(e) => setNewSeries({ ...newSeries, icon: e.target.value })}
        />
        <button onClick={handleAdd}>➕ Add</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No series found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Icon</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    {editSeriesId === s.id ? (
                      <input
                        value={editSeriesData.title}
                        onChange={(e) =>
                          setEditSeriesData({ ...editSeriesData, title: e.target.value })
                        }
                      />
                    ) : (
                      s.title
                    )}
                  </td>
                  <td>
                    {editSeriesId === s.id ? (
                      <input
                        value={editSeriesData.icon}
                        onChange={(e) =>
                          setEditSeriesData({ ...editSeriesData, icon: e.target.value })
                        }
                      />
                    ) : (
                      s.icon
                    )}
                  </td>
                  <td >
                    {editSeriesId === s.id ? (
                      <>
                        <button onClick={handleUpdate}>💾 Save</button>
                        <button
                          onClick={() => {
                            setEditSeriesId(null);
                            setEditSeriesData({ title: '', icon: '' });
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
                {series.find((s) => s.id === confirmDeleteId)?.title || 'this series'}
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

export default ManageSeriesView;
