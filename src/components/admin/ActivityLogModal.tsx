import { useState, useEffect } from 'react';
import { X, Activity, Calendar, User, AlertCircle, Filter } from 'lucide-react';
import { UserDetailed, Activity as ActivityType, ACTION_LABELS } from '@/types/user';
import { userService } from '@/services/users';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetailed;
}

export default function ActivityLogModal({
  isOpen,
  onClose,
  user,
}: ActivityLogModalProps) {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState<string>('all');

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters = {
          page: currentPage,
          limit: 10,
          ...(actionFilter !== 'all' && { action: actionFilter }),
        };

        const response = await userService.getActivity(user.id, filters);
        setActivities(response.activities);
        setTotalPages(response.pagination.totalPages);
      } catch (err: any) {
        setError(err.message || 'Failed to load activity');
        console.error('Error fetching activity:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchActivities();
    }
  }, [isOpen, user.id, currentPage, actionFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [actionFilter]);

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  // Get action label
  const getActionLabel = (action: string): string => {
    return ACTION_LABELS[action as keyof typeof ACTION_LABELS] || action;
  };

  // Get action color
  const getActionColor = (action: string): string => {
    const colors: Record<string, string> = {
      login: 'bg-green-100 text-green-800',
      logout: 'bg-gray-100 text-gray-800',
      register: 'bg-blue-100 text-blue-800',
      password_reset_request: 'bg-yellow-100 text-yellow-800',
      password_reset_complete: 'bg-purple-100 text-purple-800',
      email_verified: 'bg-blue-100 text-blue-800',
      roles_updated: 'bg-orange-100 text-orange-800',
      status_updated: 'bg-red-100 text-red-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Activity Log
                  </h3>
                  <p className="text-sm text-purple-100">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white px-6 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="register">Register</option>
                <option value="password_reset_request">Password Reset Request</option>
                <option value="password_reset_complete">Password Reset Complete</option>
                <option value="email_verified">Email Verified</option>
                <option value="roles_updated">Roles Updated</option>
                <option value="status_updated">Status Updated</option>
              </select>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-6 py-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No activity found</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}
                        >
                          {getActionLabel(activity.action)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                      </div>

                      {/* Details */}
                      {activity.details && Object.keys(activity.details).length > 0 && (
                        <div className="mt-2 text-sm text-gray-700">
                          {activity.details.old_roles && activity.details.new_roles && (
                            <div>
                              <span className="text-gray-500">Roles changed from </span>
                              <span className="font-medium">{activity.details.old_roles.join(', ')}</span>
                              <span className="text-gray-500"> to </span>
                              <span className="font-medium">{activity.details.new_roles.join(', ')}</span>
                            </div>
                          )}
                          {activity.details.status !== undefined && (
                            <div>
                              <span className="text-gray-500">Status changed to </span>
                              <span className={`font-medium ${activity.details.status ? 'text-green-600' : 'text-red-600'}`}>
                                {activity.details.status ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          )}
                          {activity.details.ip_address && (
                            <div className="text-xs text-gray-500 mt-1">
                              IP: {activity.details.ip_address}
                            </div>
                          )}
                          {activity.details.user_agent && (
                            <div className="text-xs text-gray-500">
                              Device: {activity.details.user_agent}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Performed by */}
                      {activity.performed_by_name && (
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          <span>Performed by {activity.performed_by_name}</span>
                        </div>
                      )}

                      {/* Full timestamp */}
                      <div className="mt-2 flex items-center text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(activity.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {!loading && !error && totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
