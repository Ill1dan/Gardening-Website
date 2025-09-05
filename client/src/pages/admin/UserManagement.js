import React, { useState, useEffect, useCallback } from 'react';
import userService from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  ShieldCheckIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

// Edit User Modal Component - moved outside to prevent re-creation
const EditUserModal = ({ selectedUser, onClose, onUpdate }) => {
  const [newRole, setNewRole] = useState(selectedUser?.role || 'viewer');

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-admin';
      case 'gardener':
        return 'badge-gardener';
      default:
        return 'badge-viewer';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Edit User Role
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>User:</strong> {selectedUser?.fullName} ({selectedUser?.email})
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Current Role:</strong> 
            <span className={`ml-2 ${getRoleBadgeClass(selectedUser?.role)}`}>
              {selectedUser?.role}
            </span>
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Role
          </label>
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="input-field"
          >
            <option value="viewer">Viewer</option>
            <option value="gardener">Gardener</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdate(selectedUser._id, newRole)}
            className="btn-primary"
          >
            Update Role
          </button>
        </div>
      </div>
    </div>
  );
};

// Experience Level Modal Component - moved outside to prevent re-creation
const ExperienceLevelModal = ({ selectedUser, onClose, onUpdate }) => {
  const [newExperienceLevel, setNewExperienceLevel] = useState(selectedUser?.experienceLevel || 'beginner');

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-admin';
      case 'gardener':
        return 'badge-gardener';
      default:
        return 'badge-viewer';
    }
  };

  const getExperienceColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'text-green-600';
      case 'intermediate':
        return 'text-blue-600';
      case 'advanced':
        return 'text-purple-600';
      case 'expert':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Update Experience Level
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>User:</strong> {selectedUser?.fullName} ({selectedUser?.email})
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Role:</strong> 
            <span className={`ml-2 ${getRoleBadgeClass(selectedUser?.role)}`}>
              {selectedUser?.role}
            </span>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Current Experience:</strong> 
            <span className={`ml-2 capitalize font-medium ${getExperienceColor(selectedUser?.experienceLevel)}`}>
              {selectedUser?.experienceLevel}
            </span>
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Experience Level
          </label>
          <select
            value={newExperienceLevel}
            onChange={(e) => setNewExperienceLevel(e.target.value)}
            className="input-field"
          >
            <option value="beginner">🌱 Beginner</option>
            <option value="intermediate">🌿 Intermediate</option>
            <option value="advanced">🌳 Advanced</option>
            <option value="expert">🏆 Expert</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Choose the appropriate experience level for this user
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdate(selectedUser._id, newExperienceLevel)}
            disabled={newExperienceLevel === selectedUser?.experienceLevel}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Experience
          </button>
        </div>
      </div>
    </div>
  );
};

// Ban User Modal Component - moved outside to prevent re-creation
const BanUserModal = ({ selectedUser, banReason, setBanReason, onClose, onBan }) => {
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-admin';
      case 'gardener':
        return 'badge-gardener';
      default:
        return 'badge-viewer';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Ban User
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>User:</strong> {selectedUser?.fullName} ({selectedUser?.email})
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Current Role:</strong> 
            <span className={`ml-2 ${getRoleBadgeClass(selectedUser?.role)}`}>
              {selectedUser?.role}
            </span>
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ban Reason
          </label>
          <textarea
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            placeholder="Enter reason for banning this user..."
            className="input-field h-24 resize-none"
            maxLength={500}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            {banReason.length}/500 characters
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => onBan(selectedUser._id, banReason)}
            disabled={!banReason.trim()}
            className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ban User
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    isActive: '',
    isBanned: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalUsers: 0
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [filters, pagination.current]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: 10,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const result = await userService.getAllUsers(params);
      
      if (result.success) {
        setUsers(result.users);
        setPagination(result.pagination);
      } else {
        console.error('Failed to fetch users:', result.message);
        toast.error(result.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await userService.getUserStats();
      if (result.success) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleRoleUpdate = useCallback(async (userId, newRole) => {
    try {
      const result = await userService.updateUserRole(userId, newRole);
      if (result.success) {
        toast.success(result.message);
        fetchUsers();
        fetchStats();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  }, []);

  const handleUserDeactivate = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        const result = await userService.deactivateUser(userId);
        if (result.success) {
          toast.success(result.message);
          fetchUsers();
          fetchStats();
        }
      } catch (error) {
        console.error('Error deactivating user:', error);
      }
    }
  };

  const handleUserReactivate = async (userId) => {
    try {
      const result = await userService.reactivateUser(userId);
      if (result.success) {
        toast.success(result.message);
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error reactivating user:', error);
    }
  };

  const handleCloseBanModal = useCallback(() => {
    setIsBanModalOpen(false);
    setBanReason('');
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleCloseExperienceModal = useCallback(() => {
    setIsExperienceModalOpen(false);
  }, []);

  const handleExperienceUpdate = useCallback(async (userId, experienceLevel) => {
    try {
      const result = await userService.updateUserExperience(userId, experienceLevel);
      if (result.success) {
        toast.success(result.message);
        fetchUsers();
        fetchStats();
        setIsExperienceModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating experience level:', error);
      toast.error('Failed to update experience level');
    }
  }, []);

  const handleUserBan = useCallback(async (userId, reason) => {
    try {
      const result = await userService.banUser(userId, reason);
      if (result.success) {
        toast.success(result.message);
        fetchUsers();
        fetchStats();
        setIsBanModalOpen(false);
        setBanReason('');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  }, []);

  const handleUserUnban = async (userId) => {
    if (window.confirm('Are you sure you want to unban this user?')) {
      try {
        const result = await userService.unbanUser(userId);
        if (result.success) {
          toast.success(result.message);
          fetchUsers();
          fetchStats();
        }
      } catch (error) {
        console.error('Error unbanning user:', error);
        toast.error('Failed to unban user');
      }
    }
  };

  const handlePermanentDelete = async (userId) => {
    const user = users.find(u => u._id === userId);
    const confirmMessage = `Are you sure you want to PERMANENTLY DELETE this user?\n\nThis will:\n- Delete the user account\n- Delete all plants created by this user\n- Delete all reviews by this user\n- Delete all favorites by this user\n\nThis action CANNOT be undone!\n\nUser: ${user?.firstName} ${user?.lastName} (${user?.email})`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const result = await userService.permanentlyDeleteUser(userId);
        if (result.success) {
          toast.success(result.message);
          fetchUsers();
          fetchStats();
        }
      } catch (error) {
        console.error('Error permanently deleting user:', error);
        toast.error('Failed to permanently delete user');
      }
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-admin';
      case 'gardener':
        return 'badge-gardener';
      default:
        return 'badge-viewer';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">
          Manage user accounts, roles, and permissions.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Viewers</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.byRole.viewer}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Gardeners</h3>
            <p className="text-2xl font-bold text-green-600">{stats.byRole.gardener}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Admins</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.byRole.admin}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Filter
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="input-field"
            >
              <option value="">All Roles</option>
              <option value="viewer">Viewer</option>
              <option value="gardener">Gardener</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field"
            >
              <option value="createdAt">Join Date</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="role">Role</option>
              <option value="lastLogin">Last Login</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="input-field"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ban Status
            </label>
            <select
              value={filters.isBanned}
              onChange={(e) => handleFilterChange('isBanned', e.target.value)}
              className="input-field"
            >
              <option value="">All Users</option>
              <option value="false">Not Banned</option>
              <option value="true">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading users..." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ban Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-600">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                              {currentUser?.id === user._id && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.experienceLevel === 'beginner' ? 'bg-green-100 text-green-800' :
                          user.experienceLevel === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                          user.experienceLevel === 'advanced' ? 'bg-purple-100 text-purple-800' :
                          user.experienceLevel === 'expert' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.experienceLevel === 'beginner' && '🌱'}
                          {user.experienceLevel === 'intermediate' && '🌿'}
                          {user.experienceLevel === 'advanced' && '🌳'}
                          {user.experienceLevel === 'expert' && '🏆'}
                          <span className="ml-1">{user.experienceLevel}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isBanned ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <ShieldCheckIcon className="w-3 h-3 mr-1" />
                            Not Banned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-1">
                          {/* Edit role button - hide for current user */}
                          {currentUser?.id !== user._id && (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setIsEditModalOpen(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Edit Role"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          )}

                          {/* Experience level button - show for gardeners and viewers */}
                          {(user.role === 'gardener' || user.role === 'viewer') && (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setIsExperienceModalOpen(true);
                              }}
                              className="text-purple-600 hover:text-purple-900 p-1"
                              title="Update Experience Level"
                            >
                              <AcademicCapIcon className="w-4 h-4" />
                            </button>
                          )}
                          
                          {/* Ban/Unban buttons - hide for current user */}
                          {currentUser?.id !== user._id && (
                            user.isBanned ? (
                              <button
                                onClick={() => handleUserUnban(user._id)}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Unban User"
                              >
                                <ShieldCheckIcon className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsBanModalOpen(true);
                                }}
                                className="text-orange-600 hover:text-orange-900 p-1"
                                title="Ban User"
                              >
                                <ShieldExclamationIcon className="w-4 h-4" />
                              </button>
                            )
                          )}
                          
                          {/* Deactivate/Reactivate buttons - hide for current user */}
                          {currentUser?.id !== user._id && (
                            user.isActive ? (
                              <button
                                onClick={() => handleUserDeactivate(user._id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Deactivate User"
                              >
                                <XCircleIcon className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserReactivate(user._id)}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Reactivate User"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                              </button>
                            )
                          )}
                          
                          {/* Permanent delete button - hide for current user */}
                          {currentUser?.id !== user._id && (
                            <button
                              onClick={() => handlePermanentDelete(user._id)}
                              className="text-red-800 hover:text-red-900 p-1"
                              title="Permanently Delete User"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 1 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.current - 1) * 10) + 1} to {Math.min(pagination.current * 10, pagination.totalUsers)} of {pagination.totalUsers} users
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current - 1)}
                      disabled={pagination.current === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.current + 1)}
                      disabled={pagination.current === pagination.total}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <EditUserModal
          selectedUser={selectedUser}
          onClose={handleCloseEditModal}
          onUpdate={handleRoleUpdate}
        />
      )}

      {/* Experience Level Modal */}
      {isExperienceModalOpen && (
        <ExperienceLevelModal
          selectedUser={selectedUser}
          onClose={handleCloseExperienceModal}
          onUpdate={handleExperienceUpdate}
        />
      )}
      
      {/* Ban User Modal */}
      {isBanModalOpen && (
        <BanUserModal
          selectedUser={selectedUser}
          banReason={banReason}
          setBanReason={setBanReason}
          onClose={handleCloseBanModal}
          onBan={handleUserBan}
        />
      )}
    </div>
  );
};

export default UserManagement;
