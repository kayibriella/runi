import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Wallet, FolderOpen, DollarSign, Calendar } from "lucide-react";

export function ExpenseCategoryManager() {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [editingId, setEditingId] = useState<Id<"expensecategory"> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
  const [error, setError] = useState("");

  const categories = useQuery(api.expenseCategories.list);
  const createCategory = useMutation(api.expenseCategories.create);
  const updateCategory = useMutation(api.expenseCategories.update);
  const deleteCategory = useMutation(api.expenseCategories.remove);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      if (editingId) {
        await updateCategory({
          id: editingId,
          name: name.trim(),
          budget: budget ? parseFloat(budget) : undefined,
        });
      } else {
        await createCategory({
          name: name.trim(),
          budget: budget ? parseFloat(budget) : undefined,
        });
      }
      setIsModalOpen(false);
      setName("");
      setBudget("");
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const openCreateModal = () => {
    setName("");
    setBudget("");
    setEditingId(null);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setName(category.name);
    setBudget(category.budget?.toString() || "");
    setEditingId(category._id);
    setError("");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category: any) => {
    setCategoryToDelete(category);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory({ id: categoryToDelete._id });
        setIsDeleteConfirmOpen(false);
        setCategoryToDelete(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete category");
      }
    }
  };

  if (!categories) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-dark-text tracking-tight">Expense Categories</h2>
        <Button 
          variant="primary" 
          onClick={openCreateModal}
          className="shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} className="mr-2" />
          Create Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <motion.div
                key={cat._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl group-hover:bg-blue-600 transition-colors duration-300">
                    <Wallet className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => openEditModal(cat)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Edit Category"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(cat)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-dark-text text-lg truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-body">
                    Created {new Date(cat._creationTime).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-dark-border/50">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <DollarSign size={16} className="text-gray-400" />
                    <span className="text-sm font-medium">Budget</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    cat.budget 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}>
                    {cat.budget ? `$${cat.budget.toLocaleString()}` : "Not Set"}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white dark:bg-dark-card rounded-2xl border border-dashed border-gray-300 dark:border-dark-border p-12 text-center">
              <div className="bg-gray-50 dark:bg-gray-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-dark-text mb-2">No categories yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">Create your first expense category to start organizing your business spending.</p>
              <Button 
                variant="primary" 
                onClick={openCreateModal}
                className="shadow-lg shadow-blue-500/20"
              >
                Create First Category
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Category" : "Create New Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            error={error}
            placeholder="e.g., Marketing, Rent, Utilities"
            autoFocus
          />

          <Input
            label="Monthly Budget (Optional)"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button"
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary"
            >
              {editingId ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteConfirmOpen} 
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete the category <strong>{categoryToDelete?.name}</strong>? This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              variant="secondary" 
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
