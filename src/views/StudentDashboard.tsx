import React from 'react';

type studentBoardProps = {
  isStudentLogin: boolean;
  t: (v: string) => string;
};

const StudentDashboard: React.FC<studentBoardProps> = ({ isStudentLogin }) => {
  return (
    <>
      <div>
        <h2>Student Dashboard</h2>
      </div>
    </>
  );
};

export default StudentDashboard;
