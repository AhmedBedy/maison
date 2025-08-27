// src/components/SubjectsView.tsx
import React, { useEffect, useState } from 'react';
import { fetchSubjectsByGrade } from '../api/schoolData';
import '../styles/SubjectsView.css';
import type { TranslationKeys } from './LanguageSwitcher';

type Subject = {
  id: number;
  title: string;
  icon?: string;
  display_order?: number;

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
    fetchSubjectsByGrade(gradeId)
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
      {[...subjects]
          .sort(
            (a, b) =>
              (a.display_order ?? Number.MAX_SAFE_INTEGER) -
              (b.display_order ?? Number.MAX_SAFE_INTEGER)
          )
          .map((subject) => (
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
