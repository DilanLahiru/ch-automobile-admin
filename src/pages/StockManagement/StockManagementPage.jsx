import React, { useState, useEffect, use } from "react";
import {
  Plus,
  Filter,
  MoreHorizontal,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Box,
  Edit,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { SearchBar } from "../../components/ui/SearchBar";
import { AddProductDialog } from "../../components/AddProductDialog";
import { UpdateProductDialog } from "../../components/UpdateProductDialog";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../../features/productSlice";
import { toast } from "react-toastify";

export function StockManagementPage() {
  const dispatch = useDispatch();
  const { products: productsFromRedux, loading: productsLoading } = useSelector(
    (state) => state.product,
  );


  const [searchTerm, setSearchTerm] = useState("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isUpdateProductOpen, setIsUpdateProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  useEffect(() => {
    handleLoadProducts();
  }, []);


  const getStatusBadge = (quantity, minimumStock) => {
    if (quantity === 0) {
      return (
        <Badge variant="error" className="gap-1">
          <XCircle className="h-3 w-3" /> Out of Stock
        </Badge>
      );
    } else if (quantity <= minimumStock) {
      return (
        <Badge variant="warning" className="gap-1">
          <AlertTriangle className="h-3 w-3" /> Low Stock
        </Badge>
      );
    } else {
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" /> In Stock
        </Badge>
      );
    }
  };

  const handleLoadProducts = () => {
    dispatch(getAllProducts());
  };

  const handleAddProduct = (productData) => {
    setIsAddProductOpen(false);
    // Reload products after adding
    dispatch(getAllProducts());
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsUpdateProductOpen(true);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setIsUpdateProductOpen(false);
    setSelectedProduct(null);
    // Reload products after updating
    dispatch(getAllProducts());
  };

  const handleProductDeleted = () => {
    setIsUpdateProductOpen(false);
    setSelectedProduct(null);
    // Reload products after deletion
    dispatch(getAllProducts());
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      await dispatch(deleteProduct(productId)).unwrap();
      toast.success("Product deleted successfully!");
      dispatch(getAllProducts());
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error || "Failed to delete product");
    }
  };

  // Filter products based on search term name and supplier name
  const filteredData = (productsFromRedux || []).filter((item) => {
    const name = item?.name?.toLowerCase?.();
    const supplierName = item?.supplierName?.toLowerCase?.();
    return (
      name?.includes(searchTerm.toLowerCase()) ||
      supplierName?.includes(searchTerm.toLowerCase()) ||
      false
    );
  });

  // Calculate Stats
  const totalProducts = (productsFromRedux || []).length;
  const lowStockCount = (productsFromRedux || []).filter(
    (i) => i.quantity > 0 && i.quantity <= i.minimumStock,
  ).length;
  const outOfStockCount = (productsFromRedux || []).filter(
    (i) => i.quantity === 0,
  ).length;
  const totalValue = (productsFromRedux || []).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory management
          </h1>
          <p className="text-sm text-gray-500">
            Manage parts inventory, reorder levels, and suppliers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Import CSV</Button>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsAddProductOpen(true)}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card noPadding className="overflow-visible">
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-72">
            <SearchBar
              placeholder="Search part name"
              value={searchTerm}
              onSearch={setSearchTerm}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter className="h-3.5 w-3.5" />}
            >
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Available Quantity</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr
                  key={item._id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                        <Box className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.supplierName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.categoryName}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                  Rs {item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.initialStock}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{item.quantity}</span>
                      <span className="text-xs text-gray-400">
                        / {item.initialStock}
                      </span>
                    </div>
                    {/* Simple progress bar for stock level visualization */}
                    <div className="mt-1 h-1.5 w-24 rounded-full bg-gray-100">
                      <div
                        className={`h-1.5 rounded-full ${
                          item.quantity === 0
                            ? "bg-red-500"
                            : item.quantity <= item.minimumStock
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        }
                        }`}
                        style={{
                          width: `${Math.min((item.quantity / item.initialStock) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.quantity, item.minimumStock)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProduct(item)}
                        title="Edit product"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium">1-{filteredData.length}</span>{" "}
            of <span className="font-medium">{totalProducts}</span> results
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>
      {/* Add Product Dialog */}
      <AddProductDialog
        open={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Update Product Dialog */}
      <UpdateProductDialog
        open={isUpdateProductOpen}
        onClose={() => setIsUpdateProductOpen(false)}
        product={selectedProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleProductDeleted}
      />
    </div>
  );
}
