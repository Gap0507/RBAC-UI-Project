import React, { useState, useMemo } from 'react';
import { Users, Shield, Activity, AlertCircle, BarChart2, PieChart, Filter, RotateCcw as Refresh, Download, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';


const Dashboard = ({ isDarkMode, onTabChange }) => {
  const [stats, setStats] = useState({
    totalUsers: 254,
    activeUsers: 187,
    totalRoles: 5,
    activeRoles: 4,
    permissions: 12,
    securityIncidents: 3
  });

  const [timeRange, setTimeRange] = useState('last-month');
  const [isLoading, setIsLoading] = useState(false);

  const userGrowthData = [
    { month: 'Jan', users: 100, newUsers: 30, activeUsers: 80 },
    { month: 'Feb', users: 150, newUsers: 50, activeUsers: 120 },
    { month: 'Mar', users: 180, newUsers: 40, activeUsers: 150 },
    { month: 'Apr', users: 220, newUsers: 60, activeUsers: 190 },
    { month: 'May', users: 254, newUsers: 45, activeUsers: 220 }
  ];

  const roleDistributionData = [
    { name: 'Admin', value: 2, percentage: 5 },
    { name: 'Manager', value: 3, percentage: 10 },
    { name: 'Analyst', value: 5, percentage: 20 },
    { name: 'Viewer', value: 10, percentage: 65 }
  ];

  const securityIncidentsData = [
    { type: 'Resolved', count: 12, severity: 'Low' },
    { type: 'Pending', count: 3, severity: 'High' },
    { type: 'Ongoing', count: 2, severity: 'Critical' }
  ];

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f43f5e'];

  const cardStyles = useMemo(() => (additionalClasses = '') => `
    rounded-xl shadow-md p-6 transition-all transform hover:scale-105 
    ${isDarkMode 
      ? `bg-gray-800 text-gray-300 hover:bg-gray-700 ${additionalClasses}` 
      : `bg-white hover:shadow-lg ${additionalClasses}`
    }
  `, [isDarkMode]);

  const getGradientTextStyle = useMemo(() => () => 
    `bg-gradient-to-r ${
      isDarkMode 
        ? 'from-indigo-400 to-purple-400' 
        : 'from-indigo-600 to-purple-600'
    } bg-clip-text text-transparent`, [isDarkMode]);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStats({
        totalUsers: 260,
        activeUsers: 195,
        totalRoles: 5,
        activeRoles: 4,
        permissions: 13,
        securityIncidents: 4
      });
      setIsLoading(false);
    }, 1500);
  };

  const timeRangeOptions = [
    { value: 'last-week', label: 'Last Week' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'year-to-date', label: 'Year to Date' }
  ];

 const quickActionButtons = [
    { 
      icon: Users, 
      title: 'Add New User', 
      description: 'Streamline team onboarding',
      color: 'bg-indigo-100 text-indigo-600',
      action: () => onTabChange('users') // Redirect to UserManagement
    },
    { 
      icon: Shield, 
      title: 'Create Role', 
      description: 'Define granular access controls',
      color: 'bg-green-100 text-green-600',
      action: () => onTabChange('roles') // Redirect to RoleManagement
    },
    { 
      icon: Lock, 
      title: 'Manage Permissions', 
      description: 'Configure access levels',
      color: 'bg-purple-100 text-purple-600',
      action: () => onTabChange('permissions') // Redirect to PermissionManagement
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      {/* Time Range and Refresh Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              {timeRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-700'
            } ${isLoading ? 'cursor-wait opacity-50' : ''}`}
          >
            <Refresh 
              size={20} 
              className={`${isLoading ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {[
            { 
              title: 'Total Users', 
              value: stats.totalUsers, 
              icon: Users, 
              trend: 'up' 
            },
            { 
              title: 'Active Roles', 
              value: stats.activeRoles, 
              icon: Shield, 
              trend: 'stable' 
            },
            { 
              title: 'Permissions', 
              value: stats.permissions, 
              icon: Activity, 
              trend: 'up' 
            },
            { 
              title: 'Security Incidents', 
              value: stats.securityIncidents, 
              icon: AlertCircle, 
              trend: 'warning' 
            }
          ].map((stat, index) => (
            <motion.div 
              key={stat.title} 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: index * 0.2 }}
              className={cardStyles()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    {stat.title}
                  </h3>
                  <p className={`text-3xl font-bold mt-2 ${getGradientTextStyle()}`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon size={40} className={`${
                  isDarkMode ? 'text-indigo-400 opacity-70' : 'text-indigo-600 opacity-60'
                }`} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={cardStyles('lg:col-span-2')}
        >
          <h3 className="text-lg font-semibold">User Growth</h3>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="newUsers" fill="#6366f1" />
                <Bar dataKey="activeUsers" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Role Distribution */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={cardStyles()}
        >
          <h3 className="text-lg font-semibold">Role Distribution</h3>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <RechartPieChart>
                <Pie
                  data={roleDistributionData}
                  dataKey="percentage"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                >
                  {roleDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </RechartPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm lg:col-span-3"
    >
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActionButtons.map((action, index) => (
          <motion.div 
            key={action.title} 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            className={`
              w-full cursor-pointer 
               ${cardStyles(action.color)} 
              rounded-lg shadow-sm
              hover:brightness-110 
              transform transition-all 
            `}
            onClick={action.action}
          >
            <div className="flex flex-col p-4">
              <div className="flex items-center space-x-4 mb-2">
                <action.icon size={36} className="flex-shrink-0" />
                <h4 className="font-semibold text-base">{action.title}</h4>
              </div>
              <p className="text-sm text-gray-500 break-words line-clamp-2 sm:line-clamp-1 md:line-clamp-2">
                {action.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
