import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ManageView.css';
import type { ViewType } from '../types';
import type { TranslationKeys } from '../components/LanguageSwitcher';


type Subject = {
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

const ManageSubjectsView: React.FC<Props> = ({ setView, setAlertMsg, t }) => {
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
      setAlertMsg(t('errorLoadingSubjects'));
    } else {
      setSubjects(data || []);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newSubject.title || !newSubject.icon || newSubject.display_order === '') {
      setAlertMsg(t('pleaseFillAllFields'));
      return;
    }
    const { error } = await supabase.from('subjects').insert({
      title: newSubject.title,
      icon: newSubject.icon,
      display_order: Number(newSubject.display_order),
    });
    if (error) {
      setAlertMsg(t('errorAddingSubject'));
    } else {
      setAlertMsg(t('subjectAdded'));
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
      setAlertMsg(t('pleaseFillAllFields'));
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
      setAlertMsg(t('errorUpdatingSubject'));
    } else {
      setAlertMsg(t('subjectUpdated'));
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
      setAlertMsg(t('errorDeletingSubject'));
    } else {
      setAlertMsg(t('subjectDeleted'));
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
      <h2>📘 {t('manageSubjects')}</h2>

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
          value={newSubject.title}
          onChange={(e) => setNewSubject({ ...newSubject, title: e.target.value })}
        />
        <input
          placeholder={t('iconLabel')}
          value={newSubject.icon}
          onChange={(e) => setNewSubject({ ...newSubject, icon: e.target.value })}
        />
        <input
          placeholder={t('order')}
          type="number"
          value={newSubject.display_order}
          onChange={(e) => setNewSubject({ ...newSubject, display_order: e.target.value })}
        />
        <button onClick={handleAdd}>➕ {t('add')}</button>
      </div>

      {loading ? (
        <p>{t('loading')}</p>
      ) : filtered.length === 0 ? (
        <p>{t('noSubjectsFound')}</p>
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
      <button onClick={handleUpdate}>💾 {t('save')}</button>
      <button
        onClick={() => {
          setEditSubjectId(null);
          setEditSubjectData({ title: '', icon: '', display_order: 0 });
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
              {t('areYouSureDelete')} <strong>{
                subjects.find((s) => s.id === confirmDeleteId)?.title || t('thisSubject')
              }</strong>
              ?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmDelete}>
                ✅ {t('yes')}
              </button>
              <button className="cancel-btn" onClick={() => setConfirmDeleteId(null)}>
                ❌ {t('no')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubjectsView;