import React from 'react';
import type { ViewType } from '../types';
import '../styles/AssessmentBankView.css';

const assessmentOptions = [
  { type: 'single-choice', label: 'Multiple Choice - One Correct' },
  { type: 'multiple-choice', label: 'Multiple Choice - Multiple Correct' },
  { type: 'drag-drop', label: 'Drag and Drop' },
  { type: 'true-false', label: 'True / False' },
  { type: 'short-answer', label: 'Short Answer' },
];

const AssessmentBankView: React.FC<{
  setView: (view: ViewType) => void;
  setAssessmentType: (type: 'single-choice' | 'multiple-choice' | 'true-false') => void;
  setAlertMsg: (msg: string) => void;
}> = ({ setView, setAssessmentType, setAlertMsg }) => {
  const handleAdd = (option: { type: string; label: string }) => {
    if (option.type === 'drag-drop' || option.type === 'short-answer') {
      setAlertMsg('Not implemented yet');
      return;
    }
    setAssessmentType(option.type as 'single-choice' | 'multiple-choice' | 'true-false');
    setView('assessment-builder');
  };

  return (
    <div className="edit-course-container">
      <h2>📝 Assessment Bank</h2>
      <div className="back-row">
        <button onClick={() => setView('add-course')}>⬅ Back</button>
      </div>
      <ul className="assessment-list">
        {assessmentOptions.map((option) => (
          <li key={option.type}>
            <button onClick={() => handleAdd(option)}>{option.label}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssessmentBankView;