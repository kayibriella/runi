import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../../components/ui/Button";
import { motion } from "framer-motion";
import { FileText, DollarSign, Calendar, Tag, CheckCircle, Clock, Link as LinkIcon, AlertCircle, PlusCircle } from "lucide-react";

export function ExpenseCreator() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState("pending");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = useQuery(api.expenseCategories.list);
  const createExpense = useMutation(api.expenses.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await createExpense({
        title,
        categoryId: categoryId as Id<"expensecategory">,
        amount: parseFloat(amount),
        date: new Date(date).getTime(),
        status,
        receiptUrl: receiptUrl || undefined,
      });

      setSuccess(true);
      // Reset form
      setTitle("");
      setCategoryId("");
      setAmount("");
      setDate(new Date().toISOString().split('T')[0]);
      setStatus("pending");
      setReceiptUrl("");
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (!categories) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/40 dark:border-white/10 p-8 md:p-10 shadow-xl overflow-hidden relative"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <PlusCircle size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Create New Expense</h2>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 font-sans">Record a new business expenditure</p>
            </div>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-sm font-medium"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center gap-3 text-sm font-medium"
            >
              <CheckCircle size={18} />
              Expense created successfully!
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-full">
              <label htmlFor="title" className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 font-display">
                <FileText size={16} className="text-blue-500" />
                Expense Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-4 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-sans text-gray-900 dark:text-white placeholder:text-gray-400 shadow-sm"
                placeholder="e.g., Office Supplies Purchase"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="categoryId" className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 font-display">
                <Tag size={16} className="text-blue-500" />
                Category
              </label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-5 py-4 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-sans text-gray-900 dark:text-white appearance-none shadow-sm cursor-pointer"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="amount" className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 font-display">
                <DollarSign size={16} className="text-blue-500" />
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-5 py-4 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-sans text-gray-900 dark:text-white placeholder:text-gray-400 shadow-sm"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="date" className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 font-display">
                <Calendar size={16} className="text-blue-500" />
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-5 py-4 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-sans text-gray-900 dark:text-white shadow-sm"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 font-display">
                <CheckCircle size={16} className="text-blue-500" />
                Payment Status
              </label>
              <div className="flex gap-4 p-1 bg-gray-100/50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setStatus("pending")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-display font-bold text-sm ${
                    status === "pending" 
                      ? "bg-white dark:bg-white/10 shadow-md text-amber-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Clock size={16} />
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("paid")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-display font-bold text-sm ${
                    status === "paid" 
                      ? "bg-white dark:bg-white/10 shadow-md text-emerald-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <CheckCircle size={16} />
                  Paid
                </button>
              </div>
            </div>
            
            <div className="space-y-2 col-span-full">
              <label htmlFor="receiptUrl" className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 font-display">
                <LinkIcon size={16} className="text-blue-500" />
                Receipt URL (Optional)
              </label>
              <input
                type="url"
                id="receiptUrl"
                value={receiptUrl}
                onChange={(e) => setReceiptUrl(e.target.value)}
                className="w-full px-5 py-4 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-sans text-gray-900 dark:text-white placeholder:text-gray-400 shadow-sm"
                placeholder="https://example.com/receipt.pdf"
              />
            </div>
            
            <div className="flex justify-end pt-4 col-span-full">
              <Button
                type="submit"
                variant="primary"
                className="w-full md:w-auto px-10 py-4 rounded-2xl font-display font-bold text-base shadow-xl shadow-blue-500/20 group transition-all hover:scale-105 active:scale-95"
              >
                Create Expense Entry
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
