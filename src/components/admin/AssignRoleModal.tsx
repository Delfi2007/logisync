import { useState, useEffect } from 'react';
import { X, Shield, Check, AlertCircle } from 'lucide-react';
import { UserDetailed, Role, ROLE_COLORS } from '@/types/user';

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetailed;
  allRoles: Role[];
  onSave: (userId: number, roleIds: number[]) => Promise<void>;
}

export default function AssignRoleModal({
  isOpen,
  onClose,
  user,
  allRoles,
  onSave,
}: AssignRoleModalProps) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with user's current roles
  useEffect(() => {
    if (user) {
      setSelectedRoleIds(user.roles.map(r => r.id));
    }
  }, [user]);

  // Get combined permissions from selected roles
  const getCombinedPermissions = (): string[] => {
    const selectedRoles = allRoles.filter(r => selectedRoleIds.includes(r.id));
    const permissionsSet = new Set<string>();
    
    selectedRoles.forEach(role => {
      role.permissions.forEach(permission => {
        permissionsSet.add(permission);
      });
    });

    return Array.from(permissionsSet).sort();
  };

  // Toggle role selection
  const toggleRole = (roleId: number) => {
    setSelectedRoleIds(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
    setError(null);
  };

  // Handle save
  const handleSave = async () => {
    if (selectedRoleIds.length === 0) {
      setError('Please select at least one role');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSave(user.id, selectedRoleIds);
    } catch (err: any) {
      setError(err.message || 'Failed to assign roles');
      setSaving(false);
    }
  };

  // Get role color
  const getRoleColor = (roleName: string): string => {
    return ROLE_COLORS[roleName as keyof typeof ROLE_COLORS] || 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  const combinedPermissions = getCombinedPermissions();
  const hasChanges = JSON.stringify(selectedRoleIds.sort()) !== JSON.stringify(user.roles.map(r => r.id).sort());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Assign Roles
                  </h3>
                  <p className="text-sm text-blue-100">
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

          {/* Body */}
          <div className="bg-white px-6 py-4">
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Current Roles */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Roles
              </label>
              <div className="flex flex-wrap gap-2">
                {user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <span
                      key={role.id}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(role.name)}`}
                    >
                      {role.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">No roles assigned</span>
                )}
              </div>
            </div>

            {/* Available Roles */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Roles
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allRoles.map((role) => {
                  const isSelected = selectedRoleIds.includes(role.id);
                  return (
                    <button
                      key={role.id}
                      onClick={() => toggleRole(role.id)}
                      className={`relative flex items-start p-4 border-2 rounded-lg transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role.name)}`}>
                            {role.name}
                          </span>
                          {isSelected && (
                            <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{role.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Permission Preview */}
            {combinedPermissions.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Combined Permissions ({combinedPermissions.length})
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {combinedPermissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        <span className="font-mono text-xs">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
