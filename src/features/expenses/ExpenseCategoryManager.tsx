import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Wallet, ArrowRight, AlertCircle, TrendingUp } from "lucide-react";

export function ExpenseCategoryManager() {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [editingId, setEditingId] = useState<Id<"expensecategory"> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const categories = useQuery(api.expenseCategories.list);
  const createCategory = useMutation(api.expenseCategories.create);
  const updateCategory = useMutation(api.expenseCategories.update);
  const deleteCategory = useMutation(api.expenseCategories.remove);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateCategory({
          id: editingId,
          name,
          budget: budget ? parseFloat(budget) : undefined,
        });
        setEditingId(null);
      } else {
        await createCategory({
          name,
          budget: budget ? parseFloat(budget) : undefined,
        });
        setIsModalOpen(false);
      }
      setName("");
      setBudget("");
      setIsModalOpen(false);
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

  const handleDelete = async (id: Id<"expensecategory">) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory({ id });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/40 dark:border-white/10 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Expense Categories</h2>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 font-sans">Manage your budgets and spending categories</p>
          </div>
          <Button
            variant="primary"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display font-bold shadow-lg shadow-blue-500/20 group transition-all hover:scale-105 active:scale-95"
            onClick={openCreateModal}
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            New Category
          </Button>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                key={cat._id}
                className="group relative bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2rem] p-6 border border-white/40 dark:border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 overflow-hidden flex flex-col h-full"
              >
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
                
                <div className="relative flex flex-col h-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                      <Wallet size={22} />
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors"
                        title="Edit category"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <TrendingUp size={14} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Expense Tracker
                      </span>
                    </div>
                  </div>

                  {cat.budget ? (
                    <div className="mt-2 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/5">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mb-1">Monthly Budget</p>
                      <p className="text-lg font-bold font-display text-gray-900 dark:text-white">
                        ${cat.budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 p-3 rounded-xl bg-gray-50/50 dark:bg-black/5 border border-dashed border-gray-200 dark:border-white/5">
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-sans italic">No budget set</p>
                    </div>
                  )}

                  <div className="pt-4 mt-auto border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-sm">
                    <span className="text-gray-400 font-sans text-xs italic">
                      Created {new Date(cat._creationTime).toLocaleDateString()}
                    </span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-dashed border-gray-300 dark:border-white/10 py-16 text-center"
            >
              <div className="max-w-xs mx-auto space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <Wallet size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">No expense categories</h3>
                <p className="text-sm text-gray-500 font-sans">Start tracking your expenses by adding your first category.</p>
                <Button
                  variant="primary"
                  className="w-full mt-4 rounded-xl font-display"
                  onClick={openCreateModal}
                >
                  Add Your First Category
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal for Creating/Editing */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Category" : "Create New Category"}
      >
        <div className="p-1">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 font-display">
                Category Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-sans text-gray-900 dark:text-white placeholder:text-gray-400"
                  placeholder="e.g., Marketing, Rent, Utilities"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="budget" className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 font-display">
                Monthly Budget (Optional)
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-sans text-gray-900 dark:text-white placeholder:text-gray-400"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 rounded-xl shadow-lg shadow-blue-500/20"
              >
                {editingId ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
