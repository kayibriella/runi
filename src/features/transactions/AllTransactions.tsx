export function AllTransactions() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4">All Transactions</h2>
      <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">All Transactions Overview</h3>
          <p className="text-gray-600 dark:text-gray-400">
            View all financial transactions here. This section will display a comprehensive list of all transactions.
          </p>
        </div>
      </div>
    </div>
  );
}