import React from 'react';

type adminBoardProps = {
  isAdminLogin: boolean;
};

const AdminDashboard: React.FC<adminBoardProps> = ({ isAdminLogin }) => {
  return (
    <>
      <div>
        <h2>Admin Dashboard</h2>
      </div>
    </>
  );
};

export default AdminDashboard;
