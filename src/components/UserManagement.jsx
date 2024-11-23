import React, { useState, useEffect } from 'react';
import { 
  Users, Edit, Trash2, PlusCircle, Search, 
  ChevronDown, ChevronUp, UserPlus, Mail, Shield,
  CheckCircle, XCircle, AlertCircle, ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagement = ({ isDarkMode }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Mock API call
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await new Promise(resolve => setTimeout(() => resolve([
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-03-15', department: 'IT', activity: 98 },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-03-14', department: 'HR', activity: 85 },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Analyst', status: 'Inactive', lastLogin: '2024-03-10', department: 'Finance', activity: 45 },
          { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-03-13', department: 'Marketing', activity: 92 },
          { id: 5, name: 'David Brown', email: 'david@example.com', role: 'Analyst', status: 'Active', lastLogin: '2024-03-12', department: 'Sales', activity: 76 }
        ]), 800));
        setUsers(response);
        applyFilters(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  // Filtering and sorting functions
  const applyFilters = (userList) => {
    let result = userList.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const roleMatch = roleFilter === 'All' || user.role === roleFilter;
      const statusMatch = statusFilter === 'All' || user.status === statusFilter;

      return nameMatch && roleMatch && statusMatch;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(result);
  };

  useEffect(() => {
    applyFilters(users);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sorted = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sorted);
  };
  
 // Add/Edit User Modal
 const UserModal = () => {
  const [formData, setFormData] = useState({
    name: currentUser ? currentUser.name : '',
    email: currentUser ? currentUser.email : '',
    role: currentUser ? currentUser.role : 'Analyst',
    status: currentUser ? currentUser.status : 'Active',
    department: currentUser ? currentUser.department : '',
    activity: currentUser ? currentUser.activity : 50
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentUser) {
      // Edit existing user
      const updatedUsers = users.map(u => 
        u.id === currentUser.id ? { ...u, ...formData } : u
      );
      setUsers(updatedUsers);
      applyFilters(updatedUsers);
    } else {
      // Add new user
      const newUser = {
        ...formData,
        id: users.length + 1,
        lastLogin: new Date().toISOString().split('T')[0]
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      applyFilters(updatedUsers);
    }

    setIsModalOpen(false);
    setCurrentUser(null);
  };

  if (!isModalOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className={`w-96 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4">
            {currentUser ? 'Edit User' : 'Add New User'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />             
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Analyst">Analyst</option>
              </select>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
              <div>
                <label className="block mb-2">Activity Level</label>
                <input
                  type="range"
                  name="activity"
                  min="0"
                  max="100"
                  value={formData.activity}
                  onChange={handleChange}
                  className="w-full"
                />
                <span>{formData.activity}%</span>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
                >
                  {currentUser ? 'Update User' : 'Add User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentUser(null);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

   // Header component with sorting
   const TableHeader = ({ label, sortKey }) => (
    <th 
      className={`px-6 py-3 cursor-pointer group ${
        isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
      }`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span className="font-semibold">{label}</span>
        <ArrowUpDown size={14} className={`
          transition-colors ${
            sortConfig.key === sortKey
              ? 'text-indigo-500'
              : isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }
        `}/>
      </div>
    </th>
  );

  const UserCard = ({ user }) => (
    <motion.div
      key={user.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-xl p-4 shadow-md ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } border transition-all`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            user.status === 'Active'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`}>
            {user.status === 'Active' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
          </div>
        </div>
        <div className="flex space-x-2">
        <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
    <button
      onClick={() => {
        setCurrentUser(user);
        setIsModalOpen(true);
      }}
      className={`p-1 rounded-lg transition-colors ${
        isDarkMode
          ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
      }`}
    >
      <Edit size={16} />
    </button>
    <button
      onClick={() => {
        const updatedUsers = users.filter(u => u.id !== user.id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      }}
      className={`p-1 rounded-lg transition-colors ${
        isDarkMode
          ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
          : 'hover:bg-red-100 text-red-600 hover:text-red-700'
      }`}
    >
      <Trash2 size={16} />
    </button>
  </td>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Role</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === 'Admin'
              ? 'bg-red-100 text-red-800'
              : user.role === 'Manager'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {user.role}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Department</span>
          <span className={`text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-800'
          }`}>{user.department}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Activity</span>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                user.activity > 80
                  ? 'bg-green-500'
                  : user.activity > 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${user.activity}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`p-4 md:p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header - Responsive */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-indigo-50'
          }`}>
            <Users size={24} className="text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredUsers.length} total users • {users.filter(u => u.status === 'Active').length} active
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25"
        >
          <UserPlus size={18} />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filters - Responsive */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className={`relative rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {['role', 'status'].map((filter) => (
            <select
              key={filter}
              className={`px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              value={filter === 'role' ? roleFilter : statusFilter}
              onChange={(e) => filter === 'role' 
                ? setRoleFilter(e.target.value) 
                : setStatusFilter(e.target.value)
              }
            >
              <option value="All">{filter}</option>
              {filter === 'role' ? (
                <>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Analyst">Analyst</option>
                </>
              ) : (
                <>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </>
              )}
            </select>
          ))}
        </div>
      </div>

      {/* Responsive Layout: Mobile Cards vs Desktop Table */}
      <div className="block sm:hidden">
        {/* Mobile Card Layout */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden sm:block">
        {/* Desktop Table Layout */}
        <div className="overflow-x-auto rounded-lg">
          <table className={`w-full ${
            isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
          }`}>
            <thead className={`${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <tr>
                <TableHeader label="Name" sortKey="name" />
                <TableHeader label="Email" sortKey="email" />
                <TableHeader label="Role" sortKey="role" />
                <TableHeader label="Department" sortKey="department" />
                <TableHeader label="Status" sortKey="status" />
                <TableHeader label="Activity" sortKey="activity" />
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
  <AnimatePresence>
    {filteredUsers.map((user) => (
      <motion.tr
        key={user.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`border-b ${
          isDarkMode 
            ? 'border-gray-700 hover:bg-gray-700/50' 
            : 'border-gray-200 hover:bg-gray-50'
        }`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <span className="font-medium">{user.name}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === 'Admin'
              ? 'bg-red-100 text-red-800'
              : user.role === 'Manager'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {user.role}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{user.department}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.status === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {user.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                user.activity > 80
                  ? 'bg-green-500'
                  : user.activity > 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${user.activity}%` }}
            />
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
          <button
            onClick={() => {
              setCurrentUser(user);
              setIsModalOpen(true);
            }}
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => {
              const updatedUsers = users.filter(u => u.id !== user.id);
              setUsers(updatedUsers);
              setFilteredUsers(updatedUsers);
            }}
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                : 'hover:bg-red-100 text-red-600 hover:text-red-700'
            }`}
          >
            <Trash2 size={16} />
          </button>
        </td>
      </motion.tr>
    ))}
  </AnimatePresence>
</tbody>
          </table>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Users Found</h3>
          <p className="text-gray-500 text-center max-w-sm mb-6">
            No users match your current search and filter criteria.
            Try adjusting your filters or add a new user.
          </p>
          <button
            onClick={() => {
              setCurrentUser(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            <UserPlus size={18} />
            <span>Add New User</span>
          </button>
        </div>
      )}
      
      <UserModal />
    </div>
  );
};

export default UserManagement;