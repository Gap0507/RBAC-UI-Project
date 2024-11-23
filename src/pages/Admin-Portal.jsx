import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Menu,
  X,
  Home,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import UserManagement from '../components/UserManagement';
import RoleManagement from '../components/RoleManagement';
import PermissionsManagement from '../components/PermissionManagement';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // Automatically open sidebar for large screens
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleScreenSizeChange = () => setIsSidebarOpen(mediaQuery.matches);
    handleScreenSizeChange(); // Set initial state
    mediaQuery.addEventListener('change', handleScreenSizeChange);
    return () => mediaQuery.removeEventListener('change', handleScreenSizeChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/'); 
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Role Management', icon: ShieldCheck },
    { id: 'permissions', label: 'Permissions', icon: Lock },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  
  // Handler for tab changes that can be passed to child components
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard isDarkMode={isDarkMode} onTabChange={handleTabChange} />;
      case 'users':
        return <UserManagement isDarkMode={isDarkMode} />;
      case 'roles':
        return <RoleManagement isDarkMode={isDarkMode} />;
      case 'permissions':
        return <PermissionsManagement isDarkMode={isDarkMode} />;
      default:
        return <Dashboard isDarkMode={isDarkMode} onTabChange={handleTabChange} />;
    }
  };



  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-4 right-4 z-50 p-2 rounded-full shadow-lg transform transition-all hover:scale-110 active:scale-90 ${
          isDarkMode 
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
            : 'bg-white text-gray-800 hover:bg-gray-100'
        }`}
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-200' 
            : 'bg-white border-gray-200 text-gray-800'
        } shadow-lg transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } z-50 border-r`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-opacity-20">
          {isSidebarOpen && (
            <h1
              className={`text-xl font-bold bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-indigo-400 to-purple-400' 
                  : 'from-indigo-600 to-purple-600'
              } bg-clip-text text-transparent`}
              style={{ minWidth: '140px' }}
            >
              Admin Portal
            </h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg hover:bg-opacity-10 transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-600 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? (isDarkMode 
                    ? 'bg-gray-700 text-indigo-300' 
                    : 'bg-indigo-50 text-indigo-600')
                  : (isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-50 text-gray-700')
              }`}
              style={{ minWidth: isSidebarOpen ? '200px' : 'auto' }}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {isSidebarOpen && (
                <>
                  <span className="ml-3">{item.label}</span>
                  {activeTab === item.id && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`absolute bottom-8 ${
            isSidebarOpen ? 'w-56 mx-4' : 'w-16 mx-2'
          } flex items-center justify-center px-4 py-3 rounded-lg ${
            isDarkMode 
              ? 'text-red-400 hover:bg-red-900/20' 
              : 'text-red-600 hover:bg-red-50'
          } transition-colors`}
        >
          <LogOut size={20} />
          {isSidebarOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>

      {/* Main Content */}
<div
  className={`transition-all duration-300 ${
    isSidebarOpen ? 'lg:ml-64' : 'ml-16'
  }`}
>
  {/* Header */}
  <header className={`h-16 shadow-sm px-6 flex items-center ${
    isDarkMode 
      ? 'bg-gray-800 text-gray-200' 
      : 'bg-white text-gray-800'
  }`}>
    <div className="flex items-center">
      <h2 className="text-xl font-semibold">
        {navItems.find(item => item.id === activeTab)?.label}
      </h2>
    </div>
  </header>

  {/* Content Area */}
  <main className="p-6">
    {renderContent()}
  </main>
</div>

    </div>
  );
};

export default Sidebar;
