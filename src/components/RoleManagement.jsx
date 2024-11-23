import React, { useState, useEffect } from 'react';
import { 
  Shield, Edit, Trash2, PlusCircle, Search, 
  CheckCircle, XCircle, AlertCircle, ArrowUpDown, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RoleManagement = ({ isDarkMode }) => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Predefined permissions
  const ALL_PERMISSIONS = [
    'user_read', 'user_write', 'user_delete',
    'role_read', 'role_write', 'role_delete',
    'permission_read', 'permission_write', 'permission_delete'
  ];

  // Mock API call
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await new Promise(resolve => setTimeout(() => resolve([
          { 
            id: 1, 
            name: 'Admin', 
            description: 'Full system access',
            permissions: ['user_read', 'user_write', 'user_delete', 'role_read', 'role_write', 'role_delete', 'permission_read', 'permission_write', 'permission_delete'],
            userCount: 2,
            status: 'Active'
          },
          { 
            id: 2, 
            name: 'Manager', 
            description: 'Limited administrative access',
            permissions: ['user_read', 'user_write', 'role_read'],
            userCount: 3,
            status: 'Active'
          },
          { 
            id: 3, 
            name: 'Analyst', 
            description: 'View-only access',
            permissions: ['user_read', 'role_read'],
            userCount: 5,
            status: 'Inactive'
          }
        ]), 800));
        setRoles(response);
        applyFilters(response);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // Filtering and sorting functions
  const applyFilters = (roleList) => {
    let result = roleList.filter(role => 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredRoles(result);
  };

  useEffect(() => {
    applyFilters(roles);
  }, [searchTerm, roles]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sorted = [...filteredRoles].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredRoles(sorted);
  };

  // Role Modal Component
  const RoleModal = () => {
    const [formData, setFormData] = useState({
      name: currentRole ? currentRole.name : '',
      description: currentRole ? currentRole.description : '',
      permissions: currentRole ? currentRole.permissions : [],
      status: currentRole ? currentRole.status : 'Active'
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handlePermissionToggle = (permission) => {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permission)
          ? prev.permissions.filter(p => p !== permission)
          : [...prev.permissions, permission]
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (currentRole) {
        // Edit existing role
        const updatedRoles = roles.map(r => 
          r.id === currentRole.id ? { ...r, ...formData } : r
        );
        setRoles(updatedRoles);
        applyFilters(updatedRoles);
      } else {
        // Add new role
        const newRole = {
          ...formData,
          id: roles.length + 1,
          userCount: 0
        };
        const updatedRoles = [...roles, newRole];
        setRoles(updatedRoles);
        applyFilters(updatedRoles);
      }

      setIsModalOpen(false);
      setCurrentRole(null);
    };

    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className={`w-[32rem] p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4">
            {currentRole ? 'Edit Role' : 'Add New Role'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Role Name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
              <textarea
                name="description"
                placeholder="Role Description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border h-24 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
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

              <div>
                <h3 className="text-lg font-semibold mb-3">Permissions</h3>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_PERMISSIONS.map(permission => (
                    <label 
                      key={permission} 
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                        className="form-checkbox rounded text-indigo-600"
                      />
                      <span>{permission.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
                >
                  {currentRole ? 'Update Role' : 'Add Role'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentRole(null);
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

  // Table Header Component
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

  // Role Card for Mobile View
  const RoleCard = ({ role }) => (
    <motion.div
      key={role.id}
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
            role.status === 'Active'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`}>
            {role.status === 'Active' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-lg">{role.name}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{role.description}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setCurrentRole(role);
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
              const updatedRoles = roles.filter(u => u.id !== role.id);
              setRoles(updatedRoles);
              setFilteredRoles(updatedRoles);
            }}
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                : 'hover:bg-red-100 text-red-600 hover:text-red-700'
            }`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Users</span>
          <span className={`text-sm font-semibold ${
            isDarkMode ? 'text-gray-300' : 'text-gray-800'
          }`}>{role.userCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Permissions</span>
          <span className={`text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-800'
          }`}>{role.permissions.length}</span>
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
            <Shield size={24} className="text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Role Management</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredRoles.length} total roles • {roles.filter(r => r.status === 'Active').length} active
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentRole(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md"
        >
          <PlusCircle size={18} />
          <span>Add Role</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            }`}
          />
          <Search 
            size={20} 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} 
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <AlertCircle size={48} className="animate-pulse text-indigo-500" />
          <span className="ml-4 text-lg">Loading roles...</span>
        </div>
      )}

      {/* Desktop Table View */}
      {!loading && (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className={`w-full border-collapse ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>
              <thead>
                <tr className={`border-b ${
                  isDarkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}>
                  <TableHeader label="Role Name" sortKey="name" />
                  <TableHeader label="Description" sortKey="description" />
                  <TableHeader label="Users" sortKey="userCount" />
                  <TableHeader label="Status" sortKey="status" />
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredRoles.map((role) => (
                    <motion.tr
                      key={role.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`border-b transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-gray-800 border-gray-800' 
                          : 'hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium">{role.name}</td>
                      <td className="px-6 py-4 text-sm">{role.description}</td>
                      <td className="px-6 py-4 text-center">{role.userCount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          role.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {role.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setCurrentRole(role);
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
                              const updatedRoles = roles.filter(u => u.id !== role.id);
                              setRoles(updatedRoles);
                              setFilteredRoles(updatedRoles);
                            }}
                            className={`p-1 rounded-lg transition-colors ${
                              isDarkMode
                                ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                                : 'hover:bg-red-100 text-red-600 hover:text-red-700'
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            <AnimatePresence>
              {filteredRoles.map(role => (
                <RoleCard key={role.id} role={role} />
              ))}
            </AnimatePresence>
          </div>

          {filteredRoles.length === 0 && !loading && (
            <div className="text-center py-8">
              <UserCheck size={48} className="mx-auto mb-4 text-indigo-500" />
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No roles found
              </p>
            </div>
          )}
        </>
      )}

      {/* Role Modal */}
      <RoleModal />
    </div>
  );
};

export default RoleManagement;