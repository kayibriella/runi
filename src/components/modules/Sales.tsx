import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Search, Filter, DollarSign } from "lucide-react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { toast } from "sonner";

export function Sales() {
  const [status, setStatus] = useState<"pending" | "partial" | "completed" | "">("");
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);

  const sales = useQuery(api.sales.list, { 
    status: status || undefined 
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Sales</h1>
        <Button 
          variant="primary" 
          onClick={() => setShowNewSaleModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          New Sale
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-4">
        <div className="flex gap-4 items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-card dark:text-dark-text"
          >
            <option value="">All Sales</option>
            <option value="pending">Pending Payments</option>
            <option value="partial">Partial Payments</option>
            <option value="completed">Completed Sales</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
              {sales?.map((sale, index) => (
                <tr key={sale._id} className={index % 2 === 0 ? "bg-white dark:bg-dark-card" : "bg-gray-50 dark:bg-dark-card/50"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                    {new Date(sale._creationTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                    {sale.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {sale.items.length} item(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                    ${sale.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                    ${sale.amountPaid.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sale.status === "completed" 
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        : sale.status === "partial"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {sale.status !== "completed" && (
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        Add Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sale Modal */}
      <NewSaleModal
        isOpen={showNewSaleModal}
        onClose={() => setShowNewSaleModal(false)}
      />
    </div>
  );
}

function NewSaleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  const products = useQuery(api.products.list, {});
  const createSale = useMutation(api.sales.create);

  const addItem = () => {
    const product = products?.find(p => p._id === selectedProduct);
    if (!product) return;

    const newItem = {
      productId: product._id,
      productName: product.name,
      quantity,
      unitPrice: product.sellingPrice,
      total: quantity * product.sellingPrice,
    };

    setItems([...items, newItem]);
    setSelectedProduct("");
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || items.length === 0) return;

    try {
      await createSale({
        customerName,
        items,
        subtotal,
        tax,
        total,
        amountPaid: total, // Full payment by default
      });
      toast.success("Sale created successfully");
      onClose();
      setCustomerName("");
      setItems([]);
    } catch (error) {
      toast.error("Failed to create sale");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Sale">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-dark-text">Add Items</h3>
          
          <div className="flex gap-2">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-card dark:text-dark-text"
            >
              <option value="">Select Product</option>
              {products?.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} - ${product.sellingPrice.toFixed(2)}
                </option>
              ))}
            </select>
            
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-20"
            />
            
            <Button
              type="button"
              variant="secondary"
              onClick={addItem}
              disabled={!selectedProduct}
            >
              Add
            </Button>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="border border-gray-200 dark:border-dark-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-dark-card">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Product</th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Qty</th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Price</th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Total</th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200 dark:border-dark-border">
                      <td className="px-4 py-2 text-gray-900 dark:text-dark-text">{item.productName}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-dark-text">{item.quantity}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-dark-text">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-dark-text">${item.total.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          {items.length > 0 && (
            <div className="bg-gray-50 dark:bg-dark-card/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-gray-900 dark:text-dark-text">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-dark-text">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-dark-text">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            variant="primary" 
            className="flex-1"
            disabled={!customerName || items.length === 0}
          >
            Create Sale
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
