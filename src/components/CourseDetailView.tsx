import React, { useState } from 'react';
import '../styles/CourseDetailView.css';

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
  video_url: string | null;
  resources: Resource[] | null;
  assessment_questions: AssessmentQuestion[] | null;
};

type CourseDetailViewProps = {
  course: Course;
  onBack: () => void;
};

const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course, onBack }) => {
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  if (!course) return null;

  const resources = course.resources || [];
  const assessment = course.assessment_questions || [];

  const handleAnswerChange = (index: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    setAssessmentSubmitted(true);
    setAssessmentStarted(false);
  };

  return (
    <div className="course-detail-container">
      <button onClick={onBack} className="back-btn">🔙 Back to courses</button>

      <h1>{course.title}</h1>
      <p>{course.description}</p>

      {course.video_url ? (
        <iframe
          className="course-video"
          src={course.video_url}
          title={course.title}
          frameBorder="0"
          allowFullScreen
          width="100%"
          height="400px"
        />
      ) : (
        <p>No video available for this course.</p>
      )}

      <section className="course-resources">
        <h2>Resources</h2>
        {resources.length === 0 && <p>No resources available.</p>}
        <ul>
          {resources.map((res, i) => (
            <li key={i}>
              <a href={res.url} target="_blank" rel="noopener noreferrer">
                {res.title} ({res.type})
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="course-assessment">
        <h2>Assessment</h2>
        {!assessmentStarted && !assessmentSubmitted && (
          <button onClick={() => setAssessmentStarted(true)}>Start Assessment</button>
        )}

        {assessmentStarted && !assessmentSubmitted && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {assessment.map((q, i) => (
              <div key={i} className="assessment-question">
                <p><strong>{q.question}</strong></p>
                {q.options.map((opt, j) => (
                  <label key={j}>
                    <input
                      type="radio"
                      name={`question-${i}`}
                      value={opt}
                      checked={userAnswers[i] === opt}
                      onChange={() => handleAnswerChange(i, opt)}
                      required
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}
            <button type="submit">Submit Assessment</button>
          </form>
        )}

        {assessmentSubmitted && (
          <div>
            <p>Thank you for submitting the assessment!</p>
            <button onClick={() => {
              setAssessmentSubmitted(false);
              setUserAnswers({});
            }}>
              Restart Assessment
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default CourseDetailView;
