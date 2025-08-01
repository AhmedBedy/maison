// src/components/SubjectsView.tsx
import React, { useEffect, useState } from 'react';
import { fetchSubjects } from '../api/schoolData';
import '../styles/SubjectsView.css';
import type { TranslationKeys } from './LanguageSwitcher';

type Subject = {
  id: number;
  title: string;
  icon?: string;
};

type SubjectsViewProps = {
  gradeId: number;
  onBack: () => void;
  onSelectSubject: (subjectId: number) => void; // ✅ added
  t: (key: TranslationKeys) => string;
};

const SubjectsView: React.FC<SubjectsViewProps> = ({ gradeId, onBack, onSelectSubject }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetchSubjects()
      .then((data) => {
        if (data) setSubjects(data);
      })
      .catch((error) => {
        console.error('Error fetching subjects:', error);
      });
  }, [gradeId]);

  return (
    <div className="subjects-container">
      <button onClick={onBack} className="back-btn">
        🔙 backToGrades {/* ✅ unchanged */}
      </button>
      <h2>subjects</h2>
      <div className="subjects-list">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="subject-card"
            onClick={() => onSelectSubject(subject.id)} // ✅ added
          >
            <div className="subject-icon">{subject.icon || '📘'}</div>
            <div>{subject.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsView;
