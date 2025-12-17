export function Deposited() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4">Deposited Transactions</h2>
      <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">Deposited Funds</h3>
          <p className="text-gray-600 dark:text-gray-400">
            View all successfully deposited transactions here. This section displays funds that have been confirmed and deposited.
          </p>
        </div>
      </div>
    </div>
  );
}