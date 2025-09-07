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

    // 4. Ensure grade-subject links exist so subjects appear under grades
    const gradeSubjectPairs = selectedGradeIds.flatMap((grade_id) =>
      selectedSubjectIds.map((subject_id) => ({ grade_id, subject_id }))
    );
    // Fetch existing grade-subject links to avoid duplicates
    const {
      data: existingLinks,
      error: fetchGradeSubjectError,
    } = await supabase
      .from('grade_subjects')
      .select('grade_id, subject_id')
      .in('grade_id', selectedGradeIds)
      .in('subject_id', selectedSubjectIds);

    const existingSet = new Set(
      (existingLinks ?? []).map((l) => `${l.grade_id}-${l.subject_id}`)
    );
    const missingLinks = gradeSubjectPairs.filter(
      (l) => !existingSet.has(`${l.grade_id}-${l.subject_id}`)
    );

    let gradeSubjectError = fetchGradeSubjectError;
    if (!gradeSubjectError && missingLinks.length > 0) {
      const { error } = await supabase
        .from('grade_subjects')
        .insert(missingLinks);
      gradeSubjectError = error;
    }

  // Remove grade-subject links that no longer have any courses
  if (!gradeSubjectError) {
    const oldGradeIds = selectedCourse.course_grades.map((g) => g.grade_id);
    const oldSubjectIds = selectedCourse.course_subjects.map((s) => s.subject_id);
    const oldPairs = oldGradeIds.flatMap((grade_id) =>
      oldSubjectIds.map((subject_id) => ({ grade_id, subject_id }))
    );
    const newPairSet = new Set(
      gradeSubjectPairs.map((p) => `${p.grade_id}-${p.subject_id}`)
    );
    const removedPairs = oldPairs.filter(
      (p) => !newPairSet.has(`${p.grade_id}-${p.subject_id}`)
    );

    for (const { grade_id, subject_id } of removedPairs) {
      const { data: gradeCourses, error: gradeCoursesError } = await supabase
        .from('course_grades')
        .select('course_id')
        .eq('grade_id', grade_id);
      if (gradeCoursesError) {
        gradeSubjectError = gradeCoursesError;
        break;
      }
      const gradeCourseIds = (gradeCourses ?? []).map(
        (c: { course_id: number }) => c.course_id
      );
      if (gradeCourseIds.length === 0) {
        const { error } = await supabase
          .from('grade_subjects')
          .delete()
          .eq('grade_id', grade_id)
          .eq('subject_id', subject_id);
        if (error) gradeSubjectError = error;
        continue;
      }
      const { data: linked, error: linkedError } = await supabase
        .from('course_subjects')
        .select('course_id')
        .eq('subject_id', subject_id)
        .in('course_id', gradeCourseIds);
      if (linkedError) {
        gradeSubjectError = linkedError;
        break;
      }
      if (!linked || linked.length === 0) {
        const { error } = await supabase
          .from('grade_subjects')
          .delete()
          .eq('grade_id', grade_id)
          .eq('subject_id', subject_id);
        if (error) {
          gradeSubjectError = error;
          break;
        }
      }
    }
  }

    if (updateError || subjectError || gradeError || gradeSubjectError) {
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
