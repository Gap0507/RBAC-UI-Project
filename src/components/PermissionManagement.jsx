import React, { useState, useEffect } from 'react';
import { 
  Shield, Edit, Trash2, PlusCircle, Search, 
  ChevronDown, ChevronUp, Lock, Unlock, ArrowUpDown,
  AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PermissionManagement = ({ isDarkMode }) => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [expandedRole, setExpandedRole] = useState(null);

  // Mock permissions list
  const availablePermissions = [
    { id: 1, name: 'View Users', category: 'User Management' },
    { id: 2, name: 'Create Users', category: 'User Management' },
    { id: 3, name: 'Edit Users', category: 'User Management' },
    { id: 4, name: 'Delete Users', category: 'User Management' },
    { id: 5, name: 'View Roles', category: 'Role Management' },
    { id: 6, name: 'Create Roles', category: 'Role Management' },
    { id: 7, name: 'Edit Roles', category: 'Role Management' },
    { id: 8, name: 'Delete Roles', category: 'Role Management' },
    { id: 9, name: 'View Reports', category: 'Reporting' },
    { id: 10, name: 'Export Data', category: 'Reporting' },
    { id: 11, name: 'System Settings', category: 'Administration' },
    { id: 12, name: 'API Access', category: 'Administration' },
  ];

  // Mock API call
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await new Promise(resolve => setTimeout(() => resolve([
          {
            id: 1,
            name: 'Super Admin',
            description: 'Full system access with all permissions',
            status: 'Active',
            userCount: 3,
            permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            created: '2024-01-15',
            lastModified: '2024-03-20'
          },
          {
            id: 2,
            name: 'Manager',
            description: 'Access to manage users and view reports',
            status: 'Active',
            userCount: 8,
            permissions: [1, 2, 3, 5, 9, 10],
            created: '2024-01-20',
            lastModified: '2024-03-18'
          },
          {
            id: 3,
            name: 'Analyst',
            description: 'Basic access with reporting capabilities',
            status: 'Active',
            userCount: 15,
            permissions: [1, 5, 9, 10],
            created: '2024-02-01',
            lastModified: '2024-03-15'
          },
          {
            id: 4,
            name: 'Guest',
            description: 'Limited view-only access',
            status: 'Inactive',
            userCount: 5,
            permissions: [1, 5],
            created: '2024-02-15',
            lastModified: '2024-03-10'
          }
        ]), 800));
        setRoles(response);
        setFilteredRoles(response);
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
    let result = roleList.filter(role => {
      const searchMatch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
      return searchMatch;
    });

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
  }, [searchTerm, roles, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Role Modal Component
  const RoleModal = () => {
    const [formData, setFormData] = useState({
      name: currentRole ? currentRole.name : '',
      description: currentRole ? currentRole.description : '',
      status: currentRole ? currentRole.status : 'Active',
      permissions: currentRole ? currentRole.permissions : []
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const togglePermission = (permissionId) => {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permissionId)
          ? prev.permissions.filter(id => id !== permissionId)
          : [...prev.permissions, permissionId]
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (currentRole) {
        // Edit existing role
        const updatedRoles = roles.map(r => 
          r.id === currentRole.id ? {
            ...r,
            ...formData,
            lastModified: new Date().toISOString().split('T')[0]
          } : r
        );
        setRoles(updatedRoles);
      } else {
        // Add new role
        const newRole = {
          ...formData,
          id: roles.length + 1,
          userCount: 0,
          created: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0]
        };
        setRoles([...roles, newRole]);
      }

      setIsModalOpen(false);
      setCurrentRole(null);
    };

    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className={`w-full max-w-2xl p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
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
                required
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border ${
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

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(
                    availablePermissions.reduce((acc, perm) => ({
                      ...acc,
                      [perm.category]: [...(acc[perm.category] || []), perm]
                    }), {})
                  ).map(([category, permissions]) => (
                    <div
                      key={category}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <h4 className="font-medium mb-2">{category}</h4>
                      <div className="space-y-2">
                        {permissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className="rounded border-gray-300"
                            />
                            <span className={
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }>{permission.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
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

  const RoleCard = ({ role }) => (
    <motion.div
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
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {role.description}
            </p>
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
              const updatedRoles = roles.filter(r => r.id !== role.id);
              setRoles(updatedRoles);
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

      <div className="space-y-3">
        <div className="flex justify-between items-center">
        <span className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Users: {role.userCount}</span>
          <span className={`text-sm ${
            role.status === 'Active'
              ? 'text-green-600'
              : 'text-red-600'
          }`}>
            {role.status}
          </span>
        </div>

        <div>
          <button
            onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span className="text-sm font-medium">Permissions</span>
            {expandedRole === role.id ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          <AnimatePresence>
            {expandedRole === role.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-2 px-3">
                  {Object.entries(
                    availablePermissions
                      .filter(p => role.permissions.includes(p.id))
                      .reduce((acc, perm) => ({
                        ...acc,
                        [perm.category]: [...(acc[perm.category] || []), perm]
                      }), {})
                  ).map(([category, permissions]) => (
                    <div key={category} className="space-y-1">
                      <h4 className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{category}</h4>
                      <div className="ml-2 space-y-1">
                        {permissions.map(permission => (
                          <div
                            key={permission.id}
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {permission.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`text-xs ${
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Last modified: {role.lastModified}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Permission Management</h1>
        <button
          onClick={() => {
            setCurrentRole(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
        >
          <PlusCircle size={18} />
          <span>Add New Role</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search
            size={18}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredRoles.map(role => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      )}

      <RoleModal />
    </div>
  );
};

export default PermissionManagement;