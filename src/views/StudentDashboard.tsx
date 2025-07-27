import React from 'react';
import type { TranslationKeys } from '../components/LanguageSwitcher'; 

type studentBoardProps = {
  isStudentLogin: boolean;
  
  setAlertMsg: (view: string) => void;
  t: (v: TranslationKeys) => string;
};

const StudentDashboard: React.FC<studentBoardProps> = ({  }) => {
  return (
    <>
      <div>
        <h2>Student Dashboard</h2>
      </div>
    </>
  );
};

export default StudentDashboard;
