

// AddCourseView.tsx
import React, { useState } from 'react';
import type { ViewType } from '../types';
import { supabase } from '../supabaseClient';
import '../styles/EditCourseView.css';

type CourseForLink = {
  id: number;
  title: string;
  course_subjects: { subject_id: number }[];
  course_grades: { grade_id: number }[];
};

const AddCourseView: React.FC<{
  setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
  setSelectedCourse: (course: CourseForLink) => void;
}> = ({ setView, setAlertMsg, setSelectedCourse }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [resources, setResources] = useState<unknown[]>([]);
  const [assessment, setAssessment] = useState<unknown[]>([]);

  const handleSave = async () => {
    const { data, error } = await supabase
      .from('courses')
      .insert([
        {
          title,
          description,
          img_url: image,
          video_url: videoUrl,
          duration,
          display_order: displayOrder,
          prerequisites,
          resources,
          assessment_questions: assessment,
        },
      ])
      .select()
      .single();

    if (error) {
      setAlertMsg('Failed to add course');
    } else {
      setAlertMsg('Course added successfully');
      if (data) {
        const newCourse: CourseForLink = {
          id: data.id,
          title: data.title,
          course_subjects: [],
          course_grades: [],
        };
        setSelectedCourse(newCourse);
        setView('edit-course-link');
      } else {
        setView('manage-courses');
      }
    }
  };

  return (
    <div className="edit-course-container">
      <h2>➕ Add Course</h2>

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
          onChange={(e) =>
            setPrerequisites(
              e.target.value.split(',').map((s) => s.trim())
            )
          }
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
        </div>
      </div>
    </div>
  );
};

export default AddCourseView;
