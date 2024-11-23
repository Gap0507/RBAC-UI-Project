import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Sidebar from './pages/Admin-Portal';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import RoleManagement from './components/RoleManagement';
import PermissionsManagement from './components/PermissionManagement';

const App = () => {
  return (
    <Routes>
      {/* Login Page Route */}
      <Route path="/" element={<LoginPage />} />

      {/* Admin Portal with Sidebar */}
      <Route path="/admin-portal" element={<Sidebar />} >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="roles" element={<RoleManagement />} />
        <Route path="permissions" element={<PermissionsManagement />} />
      </Route>

      {/* Catch all route for 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
