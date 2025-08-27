// EditCourseView.tsx
import React, { useState } from 'react';
import type { ViewType } from '../types';
import { supabase } from '../supabaseClient';
import '../styles/EditCourseView.css';

type Course = {
  id: number;
  title: string;
  description?: string | null;
  image?: string | null;
  video_url?: string | null;
  duration?: string | null;
  prerequisites?: string[] | null;
  resources?: any[] | null;
  assessment_questions?: any[] | null;
  display_order?: number;
};

type Props = {
  selectedCourse: Course;
  setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
  setSelectedCourse: (course: any) => void; // ✅ Added this
};

const EditCourseView: React.FC<Props> = ({
  selectedCourse,
  setView,
  setAlertMsg,
  setSelectedCourse
}) => {
  const [title, setTitle] = useState(selectedCourse.title || '');
  const [description, setDescription] = useState(selectedCourse.description || '');
  const [image, setImage] = useState(selectedCourse.image || '');
  const [videoUrl, setVideoUrl] = useState(selectedCourse.video_url || '');
  const [duration, setDuration] = useState(selectedCourse.duration || '');
  const [displayOrder, setDisplayOrder] = useState(selectedCourse.display_order || 0);
  const [prerequisites, setPrerequisites] = useState<string[]>(selectedCourse.prerequisites || []);
  const [resources, setResources] = useState<any[]>(selectedCourse.resources || []);
  const [assessment, setAssessment] = useState<any[]>(selectedCourse.assessment_questions || []);

  const handleSave = async () => {
    const { error } = await supabase
      .from('courses')
      .update({
        title,
        description,
        img_url: image,
        video_url: videoUrl,
        duration,
        display_order: displayOrder,
        prerequisites,
        resources,
        assessment_questions: assessment,
      })
      .eq('id', selectedCourse.id);

    if (error) {
      setAlertMsg('Failed to update course');
    } else {
      setAlertMsg('Course updated successfully');
      setView('manage-courses');
    }
  };

  const handleLinkSubjectsAndGrades = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        course_subjects(subject_id),
        course_grades(grade_id)
      `)
      .eq('id', selectedCourse.id)
      .single();

    if (error || !data) {
      setAlertMsg('Failed to load course links');
      return;
    }

    setSelectedCourse(data); // ✅ Set full course with subjects/grades
    setView('edit-course-link');
  };

  return (
    <div className="edit-course-container">
      <h2>✏️ Edit Course Details</h2>

      <div className="back-row">
        <button onClick={() => setView('manage-courses')}>⬅ Back</button>
      </div>

      <div className="edit-course-form">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" />
        <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="YouTube URL" />
        <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration" />
        <input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(Number(e.target.value))}
          placeholder="Display Order"
        />

        <label>📌 Prerequisites (comma-separated)</label>
        <input
          value={prerequisites.join(',')}
          onChange={(e) => setPrerequisites(e.target.value.split(',').map((s) => s.trim()))}
        />

        <label>📚 Resources (JSON format)</label>
        <textarea
          rows={4}
          value={JSON.stringify(resources, null, 2)}
          onChange={(e) => {
            try {
              setResources(JSON.parse(e.target.value));
            } catch {
              // ignore
            }
          }}
        />

        <label>🧪 Assessment Questions (JSON format)</label>
        <textarea
          rows={4}
          value={JSON.stringify(assessment, null, 2)}
          onChange={(e) => {
            try {
              setAssessment(JSON.parse(e.target.value));
            } catch {
              // ignore
            }
          }}
        />

        <div className="add-form" style={{ marginTop: '1rem' }}>
          <button onClick={handleSave}>💾 Save</button>
          <button onClick={handleLinkSubjectsAndGrades}>🔗 Link Subjects & Grades</button>
        </div>
      </div>
    </div>
  );
};

export default EditCourseView;

