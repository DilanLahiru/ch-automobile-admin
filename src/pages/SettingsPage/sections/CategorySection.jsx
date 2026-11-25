import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  FolderOpen,
  Loader2,
  Pencil,
  Search,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories, updateCategory } from "../../../features/categorySlice";
import { toast } from "react-toastify";

export function CategorySection() {
  const dispatch = useDispatch();
  const { categories = [], loading, error } = useSelector((state) => state.category);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return categories.filter((category) =>
      (category.name || "").toLowerCase().includes(normalizedSearch),
    );
  }, [categories, searchTerm]);

  const handleEdit = (category) => {
    setEditingId(category._id);
    setCategoryName(category.name || "");
    setFormError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setCategoryName("");
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedName = categoryName.trim();
    if (!normalizedName) {
      setFormError("Category name is required.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category._id !== editingId &&
        category.name?.trim().toLowerCase() === normalizedName.toLowerCase(),
    );
    if (duplicate) {
      setFormError("A category with this name already exists.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        updateCategory({
          id: editingId,
          categoryData: { name: normalizedName },
        }),
      ).unwrap();
      toast.success("Category name updated successfully.");
      handleCancel();
    } catch (requestError) {
      toast.error(requestError || "Failed to update category name.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="category-panel"
      role="tabpanel"
      className="max-w-4xl rounded-lg bg-white p-8 shadow"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Categories</h2>
        <p className="mt-1 text-sm text-gray-600">
          View product categories and update their names.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search categories"
          aria-label="Search categories"
          className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        {loading && categories.length === 0 ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            Loading categories...
          </div>
        ) : error && categories.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => dispatch(getAllCategories())}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Try again
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-8 text-center">
            <FolderOpen className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              {searchTerm ? "No categories match your search." : "No categories found."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <li
                key={category._id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                {editingId === category._id ? (
                  <form
                    onSubmit={handleSubmit}
                    className="flex w-full flex-col gap-2 sm:flex-row sm:items-start"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={categoryName}
                        onChange={(event) => {
                          setCategoryName(event.target.value);
                          setFormError("");
                        }}
                        disabled={isSubmitting}
                        autoFocus
                        required
                        aria-label="Category name"
                        aria-invalid={Boolean(formError)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                          formError
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                        }`}
                      />
                      {formError && (
                        <p className="mt-1 text-xs text-red-600">{formError}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        aria-label="Save category name"
                        className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        aria-label="Cancel category edit"
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <FolderOpen className="h-4 w-4" />
                      </span>
                      <span className="truncate text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      disabled={isSubmitting || loading}
                      aria-label={`Edit ${category.name}`}
                      className="flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50 sm:self-auto"
                    >
                      <Pencil className="h-4 w-4" />
                      Rename
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-3 text-xs text-gray-500">
        {filteredCategories.length} of {categories.length} categories
      </p>
    </section>
  );
}
