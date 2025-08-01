import React, { useEffect, useState } from 'react';
import { fetchCoursesByGradeAndSubject } from '../api/schoolData';
import '../styles/CoursesView.css';
import type { TranslationKeys } from './LanguageSwitcher';

export type Resource = {
  url: string;
  type: string;
  title: string;
};

export type AssessmentQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type Course = {
  id: number;
  title: string;
  description: string;
  duration: string;
  img_url: string | null;
  video_url: string | null;
  resources: Resource[] | null;
  assessment_questions: AssessmentQuestion[] | null;
};

type CoursesViewProps = {
  gradeId: number;
  subjectId: number;
  onBack: () => void;
  onSelectCourse?: (course: Course) => void;
  t?: (key: TranslationKeys) => string;
};

const CoursesView: React.FC<CoursesViewProps> = ({
  gradeId,
  subjectId,
  onBack,
  onSelectCourse,
  t,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCoursesByGradeAndSubject(gradeId, subjectId)
      .then((data: any[] | null) => {
        console.log('Fetched courses data:', data);
        if (data && data.length > 0) {
          const parsedCourses: Course[] = data.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            duration: course.duration,
            img_url: course.img_url,
            video_url: course.video_url,
            resources:
              course.resources && typeof course.resources === 'string'
                ? JSON.parse(course.resources)
                : course.resources || null,
            assessment_questions:
              course.assessment_questions && typeof course.assessment_questions === 'string'
                ? JSON.parse(course.assessment_questions)
                : course.assessment_questions || null,
          }));
          setCourses(parsedCourses);
        } else {
          setCourses([]);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, [gradeId, subjectId]);

  if (loading) return <p>Loading courses...</p>;

  if (courses.length === 0) {
    return (
      <>
        <button onClick={onBack} className="back-btn">
          🔙 Back to subjects
        </button>
        <p>{t ? 'noCoursesAvailable': 'No courses available for this grade and subject.'}</p>
      </>
    );
  }

  return (
    <div className="courses-container  ltr">
      <button onClick={onBack} className="back-btn">
        🔙 Back to subjects
      </button>
      <h2>{t ? t('courses') : 'Courses'}</h2>
      <div className="courses-list">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div
              className="course-image-container"
              onClick={() => onSelectCourse?.(course)}
              style={{ cursor: 'pointer' }}
              aria-label={`View details for ${course.title}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectCourse?.(course);
              }}
            >
              <img
                className="course-image"
                src={course.img_url || 'https://via.placeholder.com/250x150?text=No+Image'}
                alt={`Thumbnail for ${course.title}`}
              />
            </div>
            <div className="course-content">
              <div className="course-title">{course.title}</div>
              <div className="course-description">{course.description}</div>
              <div className="course-duration">⏱️ {course.duration}</div>
              {onSelectCourse && (
                <div className="course-actions">
                <button onClick={() => onSelectCourse(course)}>📖 View Course</button>
              </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesView;
