import React, { useState, useEffect } from 'react'
import {
  X,
  AlertCircle,
  Package,
  Banknote,
  Hash,
} from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Dialog } from './ui/Dialog'
import { useDispatch, useSelector } from "react-redux";
import { updateProduct, deleteProduct } from "../features/productSlice";
import { toast } from "react-toastify";
import { Trash2 } from 'lucide-react';

export function UpdateProductDialog({ open, onClose, product, onUpdateProduct, onDeleteProduct }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);
  
  const [formData, setFormData] = useState({
    quantity: '',
    price: '',
    initialStock: '',
    minimumStock: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        quantity: product.quantity || '',
        price: product.price || '',
        initialStock: product.initialStock || '',
        minimumStock: product.minimumStock || '',
      })
      setErrors({})
    }
  }, [product, open])

  // Handle form validation
  const validateForm = () => {
    const newErrors = {}
    
    if (formData.quantity === '' || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required'
    }
    if (formData.price === '' || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }
    if (formData.initialStock === '' || parseInt(formData.initialStock) < 0) {
      newErrors.initialStock = 'Valid initial stock is required'
    }
    if (formData.minimumStock === '' || parseInt(formData.minimumStock) < 0) {
      newErrors.minimumStock = 'Valid minimum stock is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare product data
      const productData = {
        id: product._id,
        supplierId: product.supplierId, // Keep existing supplierId
        categoryId: product.categoryId, // Keep existing categoryId
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        initialStock: parseInt(formData.initialStock),
        minimumStock: parseInt(formData.minimumStock),
      }
      
      const result = await dispatch(updateProduct(productData)).unwrap()
      
      // Close dialog on success
      toast.success('Product updated successfully!')
      handleClose()
      onUpdateProduct && onUpdateProduct(result)
      
    } catch (error) {
      const errorMessage = error || 'Failed to update product. Please try again.'
      toast.error(errorMessage)
      setErrors(prev => ({ ...prev, submit: errorMessage }))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  // Handle delete product
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(deleteProduct(product._id)).unwrap();
      toast.success('Product deleted successfully!');
      handleClose();
      onDeleteProduct && onDeleteProduct(product._id);
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error || 'Failed to delete product. Please try again.';
      toast.error(errorMessage);
      setErrors(prev => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Reset form
  const handleClose = () => {
    setFormData({
      quantity: '',
      price: '',
      initialStock: '',
      minimumStock: '',
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Update Product"
      description={product ? `Update details for ${product.name}` : 'Update product details'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name (Read-only) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              Product Name
            </div>
          </label>
          <Input
            value={product?.name || ''}
            disabled
            className="bg-gray-50"
          />
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-500" />
              Current Quantity
            </div>
          </label>
          <Input
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            placeholder="e.g., 50"
            isError={!!errors.quantity}
          />
          {errors.quantity && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.quantity}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-gray-500" />
              Price (Rs)
            </div>
          </label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="e.g., 999.99"
            isError={!!errors.price}
          />
          {errors.price && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.price}
            </div>
          )}
        </div>

        {/* Initial Stock */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-500" />
              Initial Stock
            </div>
          </label>
          <Input
            type="number"
            min="0"
            value={formData.initialStock}
            onChange={(e) => handleChange('initialStock', e.target.value)}
            placeholder="e.g., 100"
            isError={!!errors.initialStock}
          />
          {errors.initialStock && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.initialStock}
            </div>
          )}
        </div>

        {/* Minimum Stock */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gray-500" />
              Minimum Stock Level
            </div>
          </label>
          <Input
            type="number"
            min="0"
            value={formData.minimumStock}
            onChange={(e) => handleChange('minimumStock', e.target.value)}
            placeholder="e.g., 10"
            isError={!!errors.minimumStock}
          />
          {errors.minimumStock && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.minimumStock}
            </div>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {errors.submit}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting || loading}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting || loading}
            disabled={isSubmitting || loading}
            fullWidth
          >
            Update Product
          </Button>
        </div>

        {/* Delete Button */}
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isSubmitting || loading}
          className="w-full flex items-center justify-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Remove Product
        </Button>
      </form>
    </Dialog>
  )
}
