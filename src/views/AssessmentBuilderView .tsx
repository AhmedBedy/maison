import React, { useState } from 'react';
import type { ViewType } from '../types';
import '../styles/AssessmentBuilderView.css';

interface MCAnswer {
  text: string;
  correct: boolean;
}

interface MCQuestion {
  prompt: string;
  answers: MCAnswer[];
}

interface TFStatement {
  text: string;
  isTrue: boolean;
}

const AssessmentBuilderView: React.FC<{
  setView: (view: ViewType) => void;
  type: 'single-choice' | 'multiple-choice' | 'true-false';
  addAssessment: (assessment: unknown) => void;
  setAlertMsg: (msg: string) => void;
}> = ({ setView, type, addAssessment, setAlertMsg }) => {
  const [questions, setQuestions] = useState<MCQuestion[]>([
    { prompt: '', answers: [{ text: '', correct: false }, { text: '', correct: false }] },
  ]);

  const [statements, setStatements] = useState<TFStatement[]>([
    { text: '', isTrue: true },
  ]);

  const isMC = type === 'single-choice' || type === 'multiple-choice';

  const addQuestion = () => {
    setQuestions([...questions, { prompt: '', answers: [{ text: '', correct: false }, { text: '', correct: false }] }]);
  };

  const updateQuestionPrompt = (idx: number, value: string) => {
    const updated = [...questions];
    updated[idx].prompt = value;
    setQuestions(updated);
  };

  const addAnswer = (qIdx: number) => {
    const updated = [...questions];
    updated[qIdx].answers.push({ text: '', correct: false });
    setQuestions(updated);
  };

  const updateAnswer = (qIdx: number, aIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].answers[aIdx].text = value;
    setQuestions(updated);
  };

  const markCorrect = (qIdx: number, aIdx: number, checked: boolean) => {
    const updated = [...questions];
    if (type === 'single-choice') {
      updated[qIdx].answers.forEach((a, idx) => {
        a.correct = idx === aIdx;
      });
    } else {
      updated[qIdx].answers[aIdx].correct = checked;
    }
    setQuestions(updated);
  };

  const addStatement = () => {
    setStatements([...statements, { text: '', isTrue: true }]);
  };

  const updateStatementText = (idx: number, value: string) => {
    const updated = [...statements];
    updated[idx].text = value;
    setStatements(updated);
  };

  const updateStatementTruth = (idx: number, value: boolean) => {
    const updated = [...statements];
    updated[idx].isTrue = value;
    setStatements(updated);
  };

  const handleSave = () => {
    if (isMC) {
      addAssessment({ type, questions });
    } else {
      addAssessment({ type, statements });
    }
    setAlertMsg('Assessment added');
    setView('add-course');
  };

  return (
    <div className="edit-course-container">
      <h2>🛠️ Build Assessment</h2>
      <div className="back-row">
        <button onClick={() => setView('assessment-bank')}>⬅ Back</button>
      </div>
      {isMC ? (
        <div className="builder-section">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="question-block">
              <input
                value={q.prompt}
                onChange={(e) => updateQuestionPrompt(qIdx, e.target.value)}
                placeholder={`Question ${qIdx + 1}`}
              />
              {q.answers.map((ans, aIdx) => (
                <div key={aIdx} className="answer-row">
                  {type === 'single-choice' ? (
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={ans.correct}
                      onChange={() => markCorrect(qIdx, aIdx, true)}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={ans.correct}
                      onChange={(e) => markCorrect(qIdx, aIdx, e.target.checked)}
                    />
                  )}
                  <input
                    value={ans.text}
                    onChange={(e) => updateAnswer(qIdx, aIdx, e.target.value)}
                    placeholder="Answer"
                  />
                </div>
              ))}
              <button type="button" onClick={() => addAnswer(qIdx)}>
                ➕ Add Answer
              </button>
            </div>
          ))}
          <button type="button" onClick={addQuestion} className="add-question">
            ➕ Add Question
          </button>
        </div>
      ) : (
        <div className="builder-section">
          {statements.map((s, idx) => (
            <div key={idx} className="statement-row">
              <input
                value={s.text}
                onChange={(e) => updateStatementText(idx, e.target.value)}
                placeholder={`Statement ${idx + 1}`}
              />
              <select
                value={s.isTrue ? 'true' : 'false'}
                onChange={(e) => updateStatementTruth(idx, e.target.value === 'true')}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={addStatement} className="add-question">
            ➕ Add Statement
          </button>
        </div>
      )}
      <div className="add-form" style={{ marginTop: '1rem' }}>
        <button onClick={handleSave}>💾 Save Assessment</button>
      </div>
    </div>
  );
};

export default AssessmentBuilderView;