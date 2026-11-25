import React, { useState, useEffect, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    supplier: "all",
    minPrice: "",
    maxPrice: "",
    minQuantity: "",
    maxQuantity: "",
    sortBy: "name-asc",
  });


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

  const categories = useMemo(
    () =>
      [...new Set((productsFromRedux || []).map((item) => item.categoryName).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b)),
    [productsFromRedux],
  );

  const suppliers = useMemo(
    () =>
      [...new Set((productsFromRedux || []).map((item) => item.supplierName).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b)),
    [productsFromRedux],
  );

  // Apply search and structured filters before pagination.
  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = (productsFromRedux || []).filter((item) => {
      const name = item?.name?.toLowerCase?.() || "";
      const supplierName = item?.supplierName?.toLowerCase?.() || "";
      const categoryName = item?.categoryName?.toLowerCase?.() || "";
      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        supplierName.includes(normalizedSearch) ||
        categoryName.includes(normalizedSearch);

      const matchesCategory =
        filters.category === "all" || item.categoryName === filters.category;
      const matchesSupplier =
        filters.supplier === "all" || item.supplierName === filters.supplier;

      const quantity = Number(item.quantity) || 0;
      const minimumStock = Number(item.minimumStock) || 0;
      const status =
        quantity === 0
          ? "out"
          : quantity <= minimumStock
            ? "low"
            : "in";
      const matchesStatus =
        filters.status === "all" || status === filters.status;

      const price = Number(item.price) || 0;
      const matchesMinPrice =
        filters.minPrice === "" || price >= Number(filters.minPrice);
      const matchesMaxPrice =
        filters.maxPrice === "" || price <= Number(filters.maxPrice);
      const matchesMinQuantity =
        filters.minQuantity === "" || quantity >= Number(filters.minQuantity);
      const matchesMaxQuantity =
        filters.maxQuantity === "" || quantity <= Number(filters.maxQuantity);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSupplier &&
        matchesStatus &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinQuantity &&
        matchesMaxQuantity
      );
    });

    return [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "price-asc":
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        case "price-desc":
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        case "quantity-asc":
          return (Number(a.quantity) || 0) - (Number(b.quantity) || 0);
        case "quantity-desc":
          return (Number(b.quantity) || 0) - (Number(a.quantity) || 0);
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });
  }, [productsFromRedux, searchTerm, filters]);

  const activeFilterCount =
    Number(filters.status !== "all") +
    Number(filters.category !== "all") +
    Number(filters.supplier !== "all") +
    Number(filters.minPrice !== "") +
    Number(filters.maxPrice !== "") +
    Number(filters.minQuantity !== "") +
    Number(filters.maxQuantity !== "");

  const handleFilterChange = (field, value) => {
    setFilters((previous) => ({ ...previous, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      category: "all",
      supplier: "all",
      minPrice: "",
      maxPrice: "",
      minQuantity: "",
      maxQuantity: "",
      sortBy: "name-asc",
    });
    setSearchTerm("");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const firstRecordIndex = (currentPage - 1) * pageSize;
  const paginatedData = useMemo(
    () => filteredData.slice(firstRecordIndex, firstRecordIndex + pageSize),
    [filteredData, firstRecordIndex, pageSize],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
              placeholder="Search product, supplier, or category"
              value={searchTerm}
              onSearch={setSearchTerm}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter className="h-3.5 w-3.5" />}
              onClick={() => setIsFilterOpen((open) => !open)}
              aria-expanded={isFilterOpen}
            >
              Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Button>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {isFilterOpen && (
          <div className="border-b border-gray-100 bg-gray-50/70 p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700" htmlFor="stock-status">
                  Stock status
                </label>
                <select
                  id="stock-status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700"
                >
                  <option value="all">All statuses</option>
                  <option value="in">In stock</option>
                  <option value="low">Low stock</option>
                  <option value="out">Out of stock</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700" htmlFor="product-category">
                  Category
                </label>
                <select
                  id="product-category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700"
                >
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700" htmlFor="product-supplier">
                  Supplier
                </label>
                <select
                  id="product-supplier"
                  value={filters.supplier}
                  onChange={(e) => handleFilterChange("supplier", e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700"
                >
                  <option value="all">All suppliers</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier} value={supplier}>{supplier}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700" htmlFor="product-sort">
                  Sort by
                </label>
                <select
                  id="product-sort"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700"
                >
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                  <option value="quantity-asc">Quantity: Low to high</option>
                  <option value="quantity-desc">Quantity: High to low</option>
                </select>
              </div>
            </div>
          </div>
        )}

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
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    {searchTerm || activeFilterCount > 0
                      ? "No products match your search or filters."
                      : "No products found."}
                  </td>
                </tr>
              )}
              {paginatedData.map((item) => (
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
                        <p className="font-medium text-gray-900 text-xs">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.supplierName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">
                    {item.categoryName}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 text-xs">
                  Rs {item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 text-xs">
                    {item.initialStock}
                  </td>
                  <td className="px-6 py-4 text-xs">
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
        <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium">
              {filteredData.length === 0
                ? 0
                : `${firstRecordIndex + 1}-${Math.min(firstRecordIndex + pageSize, filteredData.length)}`}
            </span>{" "}
            of <span className="font-medium">{filteredData.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500" htmlFor="product-page-size">
              Rows
            </label>
            <select
              id="product-page-size"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-2 py-1 text-xs text-gray-700"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages || filteredData.length === 0}
            >
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
