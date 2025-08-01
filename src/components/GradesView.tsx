// src/components/GradesView.tsx
import React, { useEffect, useState } from 'react';
import { fetchGradesBySeries } from '../api/schoolData';
import '../styles/GradesView.css';
import type { TranslationKeys } from './LanguageSwitcher';

type Grade = {
  id: number;
  title: string;
  serie_id: number;
};

type GradesViewProps = {
  serieId: number;
  onBack: () => void;
  onSelectGrade: (gradeId: number) => void; // ✅ Fix: Add this
  t: (key: TranslationKeys) => string;
};

const GradesView: React.FC<GradesViewProps> = ({ serieId, onBack, onSelectGrade, t }) => {
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    fetchGradesBySeries(serieId)
      .then((data) => {
        if (data) setGrades(data);
      })
      .catch((error) => {
        console.error('Failed to fetch grades:', error);
      });
  }, [serieId]);

  return (
    <div className="grades-container">
      <button onClick={onBack} className="back-btn">
        🔙 backToSeries
      </button>
      <h2>grades</h2>
      <div className="grades-list">
        {grades.map((grade) => (
          <div
            key={grade.id}
            className="grade-card"
            onClick={() => onSelectGrade(grade.id)} // ✅ Call this
          >
            {grade.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradesView;
