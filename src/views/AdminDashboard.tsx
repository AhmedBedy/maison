import React from 'react';
import type { TranslationKeys } from '../components/LanguageSwitcher'; 

type adminBoardProps = {
  isAdminLogin: boolean;
  
  setAlertMsg: (view: string) => void;
  t: (v: TranslationKeys) => string;
};

const AdminDashboard: React.FC<adminBoardProps> = ({  }) => {
  return (
    <>
      <div>
        <h2>Admin Dashboard</h2>
      </div>
    </>
  );
};

export default AdminDashboard;
