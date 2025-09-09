import React, { useState } from 'react';
import '../styles/CourseDetailView.css';

export type Resource = {
  url: string;
  type: string;
  title: string;
};

type MCAnswer = {
  text: string;
  correct: boolean;
};

type MCQuestion = {
  prompt: string;
  answers: MCAnswer[];
};

type TFStatement = {
  text: string;
  isTrue: boolean;
};

type AssessmentItem =
  | { type: 'single-choice' | 'multiple-choice'; questions: MCQuestion[] }
  | { type: 'true-false'; statements: TFStatement[] };

export type Course = {
  id: number;
  title: string;
  description: string;
  video_url: string | null;
  resources: Resource[] | null;
  assessment_questions: AssessmentItem[] | null;
};

type CourseDetailViewProps = {
  course: Course;
  onBack: () => void;
};

const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course, onBack }) => {
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[] | boolean>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  if (!course) return null;

  const resources = course.resources || [];
  const assessment = course.assessment_questions || [];

  const handleMCAnswerChange = (
    key: string,
    value: string,
    checked: boolean,
    isMultiple: boolean,
  ) => {
    setUserAnswers((prev) => {
      if (isMultiple) {
        const existing = Array.isArray(prev[key]) ? [...(prev[key] as string[])] : [];
        const updated = checked
          ? [...existing, value]
          : existing.filter((v) => v !== value);
        return { ...prev, [key]: updated };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleTFChange = (key: string, value: boolean) => {
    setUserAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    let total = 0;
    let correct = 0;

    assessment.forEach((section, sIdx) => {
      if (section.type === 'true-false') {
        section.statements.forEach((s, idx) => {
          total += 1;
          const key = `tf-${sIdx}-${idx}`;
          if (userAnswers[key] === s.isTrue) {
            correct += 1;
          }
        });
      } else {
        section.questions.forEach((q, qIdx) => {
          total += 1;
          const key = `mc-${sIdx}-${qIdx}`;
          const ans = userAnswers[key];
          if (section.type === 'single-choice') {
            const correctAns = q.answers.find((a) => a.correct)?.text;
            if (ans === correctAns) {
              correct += 1;
            }
          } else {
            const correctOptions = q.answers
              .filter((a) => a.correct)
              .map((a) => a.text)
              .sort();
            const userSelection = Array.isArray(ans) ? [...ans].sort() : [];
            if (
              correctOptions.length === userSelection.length &&
              correctOptions.every((opt, idx) => opt === userSelection[idx])
            ) {
              correct += 1;
            }
          }
        });
      }
    });

    setScore({ correct, total });
    setAssessmentSubmitted(true);
    setAssessmentStarted(false);
  };

  return (

    <div className="course-detail-container  ltr">
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
               {assessment.map((section, sIdx) => (
              <React.Fragment key={sIdx}>
                {section.type === 'true-false'
                  ? section.statements.map((s, idx) => {
                      const key = `tf-${sIdx}-${idx}`;
                      return (
                        <div key={key} className="assessment-question">
                          <p><strong>{s.text}</strong></p>
                          <label>
                            <input
                              type="radio"
                              name={key}
                              value="true"
                              checked={userAnswers[key] === true}
                              onChange={() => handleTFChange(key, true)}
                              required
                            />
                            True
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={key}
                              value="false"
                              checked={userAnswers[key] === false}
                              onChange={() => handleTFChange(key, false)}
                              required
                            />
                            False
                          </label>
                        </div>
                      );
                    })
                  : section.questions.map((q, qIdx) => {
                      const key = `mc-${sIdx}-${qIdx}`;
                      const isMultiple = section.type === 'multiple-choice';
                      const answer = userAnswers[key];
                      return (
                        <div key={key} className="assessment-question">
                          <p><strong>{q.prompt}</strong></p>
                          {q.answers.map((ans, aIdx) => (
                            <label key={aIdx}>
                              <input
                                type={isMultiple ? 'checkbox' : 'radio'}
                                name={key}
                                value={ans.text}
                                checked={
                                  isMultiple
                                    ? Array.isArray(answer) && answer.includes(ans.text)
                                    : answer === ans.text
                                }
                                onChange={(e) =>
                                  handleMCAnswerChange(
                                    key,
                                    ans.text,
                                    e.target.checked,
                                    isMultiple,
                                  )
                                }
                                required={!isMultiple}
                              />
                              {ans.text}
                            </label>
                          ))}
                        </div>
                      );
                    })}
              </React.Fragment>
            ))}
            <button type="submit">Submit Assessment</button>
          </form>
        )}

{assessmentSubmitted && score && (
          <div>
            {score.correct === score.total ? (
              <p>Great you passed! Score: {score.correct} / {score.total}</p>
            ) : (
              <>
                <p>
                  Score: {score.correct} / {score.total}
                </p>
                <p>Some answers were incorrect. Please try again.</p>
                <button
                  onClick={() => {
                    setAssessmentSubmitted(false);
                    setAssessmentStarted(true);
                    setUserAnswers({});
                    setScore(null);
                  }}
                >
                  Reattempt Assessment
                </button>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CourseDetailView;
