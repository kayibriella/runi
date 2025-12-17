export function Debtors() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4">Unpaid/Debtors</h2>
      <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">Unpaid Transactions</h3>
          <p className="text-gray-600 dark:text-gray-400">
            View all unpaid transactions and debtor records here. This section displays pending payments and outstanding balances.
          </p>
        </div>
      </div>
    </div>
  );
}