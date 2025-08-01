// src/views/CourseManager.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/CourseManager.css';

type Grade = { id: number; title: string };
type Subject = { id: number; title: string };

const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchGrades();
    fetchSubjects();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) console.error('Fetch courses error:', error.message);
    else setCourses(data || []);
  };

  const fetchGrades = async () => {
    const { data, error } = await supabase.from('grades').select('*');
    if (error) console.error('Fetch grades error:', error.message);
    else setGrades(data || []);
  };

  const fetchSubjects = async () => {
    const { data, error } = await supabase.from('subjects').select('*');
    if (error) console.error('Fetch subjects error:', error.message);
    else setSubjects(data || []);
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: insertedCourse, error } = await supabase
      .from('courses')
      .insert([{ title, description, video_url: videoUrl }])
      .select()
      .single();

    if (error || !insertedCourse) {
      console.error('Error inserting course:', error?.message);
      return;
    }

    const courseId = insertedCourse.id;

    // Link course to grades
    const gradeLinks = selectedGrades.map((gradeId) => ({ course_id: courseId, grade_id: gradeId }));
    await supabase.from('course_grades').insert(gradeLinks);

    // Link course to subjects
    const subjectLinks = selectedSubjects.map((subjectId) => ({ course_id: courseId, subject_id: subjectId }));
    await supabase.from('course_subjects').insert(subjectLinks);

    setTitle('');
    setDescription('');
    setVideoUrl('');
    setSelectedGrades([]);
    setSelectedSubjects([]);

    fetchCourses();
  };

  return (
    <div className="course-manager">
      <h2>📚 Add New Course</h2>
      <form className="course-form" onSubmit={handleCourseSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video URL (optional)" />

        <div className="multi-select">
          <label>Grades:</label>
          <div className="multi-list">
            {grades.map((g) => (
              <label key={g.id}>
                <input
                  type="checkbox"
                  checked={selectedGrades.includes(g.id)}
                  onChange={() =>
                    setSelectedGrades((prev) =>
                      prev.includes(g.id) ? prev.filter((id) => id !== g.id) : [...prev, g.id]
                    )
                  }
                />
                {g.title}
              </label>
            ))}
          </div>
        </div>

        <div className="multi-select">
          <label>Subjects:</label>
          <div className="multi-list">
            {subjects.map((s) => (
              <label key={s.id}>
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(s.id)}
                  onChange={() =>
                    setSelectedSubjects((prev) =>
                      prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                    )
                  }
                />
                {s.title}
              </label>
            ))}
          </div>
        </div>

        <button type="submit">➕ Add Course</button>
      </form>

      <h3>📋 Existing Courses</h3>
      <ul className="course-list">
        {courses.map((c) => (
          <li key={c.id}>
            <strong>{c.title}</strong> – {c.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseManager;
