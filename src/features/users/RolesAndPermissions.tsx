export function RolesAndPermissions() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-white/5">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Roles & Permissions</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
        The roles and permissions management system is currently being updated to provide more granular control over staff access.
      </p>
    </div>
  );
}