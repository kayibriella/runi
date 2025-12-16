import { Plus } from "lucide-react";
import { Button } from "../../components/ui/Button";

interface ProductAddingProps {
}

export function ProductAdding({}: ProductAddingProps) {
    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border border-gray-200 dark:border-dark-border">
                    <h3 className="font-medium text-gray-900 dark:text-dark-text mb-2">Import Products</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Bulk import products from CSV or Excel file
                    </p>
                    <Button variant="secondary" className="w-full text-sm">
                        Import File
                    </Button>
                </div>

                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border border-gray-200 dark:border-dark-border">
                    <h3 className="font-medium text-gray-900 dark:text-dark-text mb-2">Bulk Update</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Update multiple products at once
                    </p>
                    <Button variant="secondary" className="w-full text-sm">
                        Bulk Edit
                    </Button>
                </div>

                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border border-gray-200 dark:border-dark-border">
                    <h3 className="font-medium text-gray-900 dark:text-dark-text mb-2">Templates</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Use product templates for faster entry
                    </p>
                    <Button variant="secondary" className="w-full text-sm">
                        View Templates
                    </Button>
                </div>
            </div>
        </div>
    );
}
