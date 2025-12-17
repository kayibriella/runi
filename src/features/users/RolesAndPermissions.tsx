import { useState } from "react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export function RolesAndPermissions() {
  const [roles] = useState<Role[]>([
    {
      id: "admin",
      name: "Administrator",
      description: "Full access to all system features",
      permissions: ["all"]
    },
    {
      id: "manager",
      name: "Manager",
      description: "Access to manage products, sales, and workers",
      permissions: ["manage_products", "manage_sales", "view_workers"]
    },
    {
      id: "worker",
      name: "Worker",
      description: "Limited access to daily operations",
      permissions: ["view_products", "add_sales"]
    }
  ]);

  const [permissions] = useState<Permission[]>([
    { id: "manage_products", name: "Manage Products", description: "Add, edit, and delete products", category: "Products" },
    { id: "view_products", name: "View Products", description: "View product inventory", category: "Products" },
    { id: "manage_sales", name: "Manage Sales", description: "Process and manage sales", category: "Sales" },
    { id: "add_sales", name: "Add Sales", description: "Process new sales", category: "Sales" },
    { id: "view_workers", name: "View Workers", description: "View worker information", category: "Workers" },
    { id: "manage_workers", name: "Manage Workers", description: "Add and edit workers", category: "Workers" },
    { id: "view_reports", name: "View Reports", description: "Access business reports", category: "Analytics" },
    { id: "manage_settings", name: "Manage Settings", description: "Modify system settings", category: "System" }
  ]);

  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const currentRole = roles.find(role => role.id === selectedRole) || roles[0];

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">Roles & Permissions</h2>
        <button 
          onClick={() => setEditingRole({...currentRole})}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Edit Role
        </button>
      </div>

      {/* Role Selection */}
      <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-4">Select Role</h3>
        <div className="flex flex-wrap gap-3">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRole === role.id
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-dark-text">{currentRole.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{currentRole.description}</p>
        </div>
      </div>

      {/* Permissions by Category */}
      <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-4">Permissions</h3>
        
        <div className="space-y-8">
          {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
            <div key={category}>
              <h4 className="text-md font-medium text-gray-900 dark:text-dark-text mb-3">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryPermissions.map((permission) => (
                  <div 
                    key={permission.id} 
                    className="flex items-start p-4 border border-gray-200 dark:border-dark-border rounded-lg"
                  >
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id={`permission-${permission.id}`}
                        type="checkbox"
                        checked={currentRole.permissions.includes("all") || currentRole.permissions.includes(permission.id)}
                        disabled
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-dark-card dark:border-dark-border"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label 
                        htmlFor={`permission-${permission.id}`} 
                        className="font-medium text-gray-900 dark:text-dark-text"
                      >
                        {permission.name}
                      </label>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Edit Role: {editingRole.name}</h3>
                <button 
                  onClick={() => setEditingRole(null)}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Name</label>
                  <input
                    type="text"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-card dark:text-dark-text"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={editingRole.description}
                    onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-card dark:text-dark-text"
                  />
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-dark-text mb-3">Permissions</h4>
                  <div className="space-y-4">
                    {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                      <div key={category} className="border border-gray-200 dark:border-dark-border rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 dark:text-dark-text mb-3">{category}</h5>
                        <div className="space-y-3">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id={`edit-permission-${permission.id}`}
                                  type="checkbox"
                                  checked={editingRole.permissions.includes("all") || editingRole.permissions.includes(permission.id)}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setEditingRole(prev => {
                                      if (isChecked) {
                                        return {
                                          ...prev!,
                                          permissions: [...prev!.permissions, permission.id]
                                        };
                                      } else {
                                        return {
                                          ...prev!,
                                          permissions: prev!.permissions.filter(p => p !== permission.id)
                                        };
                                      }
                                    });
                                  }}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-dark-card dark:border-dark-border"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label 
                                  htmlFor={`edit-permission-${permission.id}`} 
                                  className="font-medium text-gray-900 dark:text-dark-text"
                                >
                                  {permission.name}
                                </label>
                                <p className="text-gray-600 dark:text-gray-400">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingRole(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-card/50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      // In a real implementation, you would save the role changes here
                      alert(`Role "${editingRole.name}" updated successfully!`);
                      setEditingRole(null);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}