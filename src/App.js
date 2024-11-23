import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import Sidebar from './pages/Admin-Portal';
import UserManagement from './components/UserManagement';
import RoleManagement from './components/RoleManagement';
import PermissionManagement from './components/PermissionManagement';

const App = () => {
  return (
    <Routes>
      {/* Login Page Route */}
      <Route path="/" element={<LoginPage />} />

      {/* Admin Portal with Sidebar */}
      <Route path="/admin-portal" element={<Sidebar />}>
        {/* Nested Routes under Sidebar */}
        <Route path="user-management" element={<UserManagement />} />
        <Route path="role-management" element={<RoleManagement />} />
        <Route path="permission-management" element={<PermissionManagement />} />
      </Route>
    </Routes>
  );
};

export default App;
