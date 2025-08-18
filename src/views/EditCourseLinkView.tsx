import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/EditCourseView.css';
import type { ViewType } from '../types';




type Course = {
  id: number;
  title: string;
  course_subjects: { subject_id: number }[];
  course_grades: { grade_id: number }[];
};

type Subject = { id: number; title: string };
type Grade = { id: number; title: string; serie_id: number };
type Series = { id: number; title: string };

type Props = {
  selectedCourse: Course;
  setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
};

const EditCourseLinkView: React.FC<Props> = ({ selectedCourse, setView, setAlertMsg }) => {
  const [title, setTitle] = useState(selectedCourse.title);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>(
    selectedCourse.course_subjects.map((s) => s.subject_id)
  );
  const [selectedGradeIds, setSelectedGradeIds] = useState<number[]>(
    selectedCourse.course_grades.map((g) => g.grade_id)
  );
  const [selectedSerieId, setSelectedSerieId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: subjectsData }, { data: gradesData }, { data: seriesData }] = await Promise.all([
      supabase.from('subjects').select('*'),
      supabase.from('grades').select('*'),
      supabase.from('series').select('*'),
    ]);
    setSubjects(subjectsData || []);
    setGrades(gradesData || []);
    setSeries(seriesData || []);
    setLoading(false);
  };

  const handleCheckboxChange = (
    id: number,
    selectedIds: number[],
    setSelected: (ids: number[]) => void
  ) => {
    if (selectedIds.includes(id)) {
      setSelected(selectedIds.filter((i) => i !== id));
    } else {
      setSelected([...selectedIds, id]);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || selectedGradeIds.length === 0 || selectedSubjectIds.length === 0) {
      setAlertMsg('Please fill all fields');
      return;
    }

    // 1. Update title
    const { error: updateError } = await supabase
      .from('courses')
      .update({ title })
      .eq('id', selectedCourse.id);

    // 2. Replace subjects
    await supabase.from('course_subjects').delete().eq('course_id', selectedCourse.id);
    const newSubjects = selectedSubjectIds.map((subject_id) => ({
      course_id: selectedCourse.id,
      subject_id,
    }));
    const { error: subjectError } = await supabase.from('course_subjects').insert(newSubjects);

    // 3. Replace grades
    await supabase.from('course_grades').delete().eq('course_id', selectedCourse.id);
    const newGrades = selectedGradeIds.map((grade_id) => ({
      course_id: selectedCourse.id,
      grade_id,
    }));
    const { error: gradeError } = await supabase.from('course_grades').insert(newGrades);

    if (updateError || subjectError || gradeError) {
      setAlertMsg('Error updating course');
    } else {
      setAlertMsg('Course updated successfully');
      setView('manage-courses');
    }
  };

  const filteredGrades = selectedSerieId
    ? grades.filter((g) => g.serie_id === selectedSerieId)
    : [];

  return (


    
    <div className="manage-container">
      <h2>✏️ Edit Course</h2>

      <div className="back-row">
        <button onClick={() => setView('manage-courses')}>⬅ Back</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="add-form">
            <input
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <h4>📘 Subjects</h4>
          <div className="checkbox-list">
            {subjects.map((s) => (
              <label key={s.id}>
                <input
                  type="checkbox"
                  checked={selectedSubjectIds.includes(s.id)}
                  onChange={() =>
                    handleCheckboxChange(s.id, selectedSubjectIds, setSelectedSubjectIds)
                  }
                />
                {s.title}
              </label>
            ))}
          </div>

          <h4>📚 Series</h4>
          <div className="add-form">
            <select
              value={selectedSerieId ?? ''}
              onChange={(e) => setSelectedSerieId(Number(e.target.value))}
            >
              <option value="">-- Select Series --</option>
              {series.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <h4>📏 Grades</h4>
          {selectedSerieId === null ? (
            <p>Please select a series to view grades.</p>
          ) : filteredGrades.length === 0 ? (
            <p>No grades found for this series.</p>
          ) : (
            <div className="checkbox-list">
              {filteredGrades.map((g) => (
                <label key={g.id}>
                  <input
                    type="checkbox"
                    checked={selectedGradeIds.includes(g.id)}
                    onChange={() =>
                      handleCheckboxChange(g.id, selectedGradeIds, setSelectedGradeIds)
                    }
                  />
                  {g.title}
                </label>
              ))}
            </div>
          )}

          <div className="add-form" style={{ marginTop: '1rem' }}>
            <button onClick={handleSave}>💾 Save</button>
            <button onClick={() => setView('manage-courses')}>❌ Cancel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditCourseLinkView;
