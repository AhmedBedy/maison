import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ManageView.css';
import type { ViewType } from '../types';
import type { TranslationKeys } from '../components/LanguageSwitcher';

type Series = {
  id: number;
  title: string;
  icon: string;
  display_order: number;
};

type Props = {
  setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
  t: (key: TranslationKeys) => string;
};

const ManageSeriesView: React.FC<Props> = ({ setView, setAlertMsg, t }) => {
  const [series, setSeries] = useState<Series[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [newSeries, setNewSeries] = useState({ title: '', icon: '', display_order: '' });
  const [editSeriesId, setEditSeriesId] = useState<number | null>(null);
  const [editSeriesData, setEditSeriesData] = useState({ title: '', icon: '', display_order: 0 });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('series').select('*').order('display_order');
    if (error) {
      setAlertMsg(t('errorLoadingSeries'));
    } else {
      setSeries(data || []);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newSeries.title || !newSeries.icon || newSeries.display_order === '') {
      setAlertMsg(t('pleaseFillAllFields'));
      return;
    }
    const { error } = await supabase.from('series').insert({
      title: newSeries.title,
      icon: newSeries.icon,
      display_order: Number(newSeries.display_order),
    });
    if (error) {
      setAlertMsg(t('errorAddingSeries'));
    } else {
      setAlertMsg(t('seriesAdded'));
      setNewSeries({ title: '', icon: '', display_order: '' });
      fetchSeries();
    }
  };

  const handleEdit = (serie: Series) => {
    setEditSeriesId(serie.id);
    setEditSeriesData({
      title: serie.title,
      icon: serie.icon,
      display_order: serie.display_order,
    });
  };

  const handleUpdate = async () => {
    if (!editSeriesData.title || !editSeriesData.icon || editSeriesData.display_order === undefined) {
      setAlertMsg(t('pleaseFillAllFields'));
      return;
    }
    const { error } = await supabase
      .from('series')
      .update({
        title: editSeriesData.title,
        icon: editSeriesData.icon,
        display_order: editSeriesData.display_order,
      })
      .eq('id', editSeriesId);
    if (error) {
      setAlertMsg(t('errorUpdatingSeries'));
    } else {
      setAlertMsg(t('seriesUpdated'));
      setEditSeriesId(null);
      setEditSeriesData({ title: '', icon: '', display_order: 0 });
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
      setAlertMsg(t('errorDeletingSeries'));
    } else {
      setAlertMsg(t('seriesDeleted'));
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
      <h2>📚 {t('manageSeries')}</h2>

      <div className="back-row">
      <button onClick={() => setView('admin-dashboard')}>⬅ {t('back')}</button>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder={t('searchByTitleOrIcon')}
                value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="add-form">
        <input
          placeholder={t('title')}
          value={newSeries.title}
          onChange={(e) => setNewSeries({ ...newSeries, title: e.target.value })}
        />
        <input
          placeholder={t('iconLabel')}
          value={newSeries.icon}
          onChange={(e) => setNewSeries({ ...newSeries, icon: e.target.value })}
        />
         <input
          placeholder={t('order')}
          type="number"
          value={newSeries.display_order}
          onChange={(e) => setNewSeries({ ...newSeries, display_order: e.target.value })}
        />
         <button onClick={handleAdd}>➕ {t('add')}</button>
      </div>

      {loading ? (
        <p>{t('loading')}</p>
      ) : filtered.length === 0 ? (
        <p>{t('noSeriesFound')}</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('title')}</th>
                <th>{t('iconLabel')}</th>
                <th>{t('order')}</th>
                <th>{t('actions')}</th>
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
                  <td>
                    {editSeriesId === s.id ? (
                      <input
                        type="number"
                        value={editSeriesData.display_order}
                        onChange={(e) =>
                          setEditSeriesData({
                            ...editSeriesData,
                            display_order: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      s.display_order
                    )}
                  </td>
                  <td>
                    {editSeriesId === s.id ? (
                      <>
                         <button onClick={handleUpdate}>💾 {t('save')}</button>
                        <button
                          onClick={() => {
                            setEditSeriesId(null);
                            setEditSeriesData({ title: '', icon: '', display_order: 0 });
                          }}
                        >
                          ❌ {t('cancel')}
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
            {t('areYouSureDelete')}{' '}
              <strong>
                {series.find((s) => s.id === confirmDeleteId)?.title || t('thisSeries')}
              </strong>
              ?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmDelete}>
              ✅ {t('yes')}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setConfirmDeleteId(null)}
              >
                ❌ {t('no')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSeriesView;
