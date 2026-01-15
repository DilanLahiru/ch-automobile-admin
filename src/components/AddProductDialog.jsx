import React, { useState } from 'react'
import {
  X,
  Upload,
  AlertCircle,
  Package,
  Truck,
  DollarSign,
  Hash,
  Tag,
  Info,
  Box,
} from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Textarea } from './ui/Textarea'
import { Switch } from './ui/Switch'
import { Dialog } from './ui/Dialog'

// Category options
const categories = [
  { value: 'engine', label: 'Engine Parts' },
  { value: 'brake', label: 'Brake System' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'suspension', label: 'Suspension' },
  { value: 'filters', label: 'Filters' },
  { value: 'fluids', label: 'Fluids' },
  { value: 'ignition', label: 'Ignition' },
  { value: 'exhaust', label: 'Exhaust System' },
  { value: 'cooling', label: 'Cooling System' },
  { value: 'interior', label: 'Interior' },
  { value: 'exterior', label: 'Exterior' },
]

// Supplier options
const suppliers = [
  { value: 'bosch', label: 'Bosch Automotive' },
  { value: 'denso', label: 'Denso' },
  { value: 'delphi', label: 'Delphi Technologies' },
  { value: 'magna', label: 'Magna International' },
  { value: 'valeo', label: 'Valeo' },
  { value: 'continental', label: 'Continental AG' },
  { value: 'mahle', label: 'Mahle' },
  { value: 'mann-filter', label: 'MANN-FILTER' },
  { value: 'local', label: 'Local Supplier' },
  { value: 'other', label: 'Other' },
]

// Unit options
const units = [
  { value: 'piece', label: 'Piece' },
  { value: 'set', label: 'Set' },
  { value: 'pair', label: 'Pair' },
  { value: 'liter', label: 'Liter' },
  { value: 'gallon', label: 'Gallon' },
  { value: 'box', label: 'Box' },
]

export function AddProductDialog({ open, onClose, onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    supplier: '',
    price: '',
    cost: '',
    stock: '',
    minLevel: '',
    unit: 'piece',
    description: '',
    location: '',
    weight: '',
    dimensions: '',
    barcode: '',
    trackInventory: true,
    notifyLowStock: true,
    image: null,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  // Generate SKU based on product name
  const generateSKU = () => {
    if (!formData.name || !formData.category) return
    
    const categoryCode = formData.category.toUpperCase().substring(0, 3)
    const nameCode = formData.name
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .substring(0, 3)
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    
    const newSKU = `${categoryCode}-${nameCode}-${randomNum}`
    setFormData(prev => ({ ...prev, sku: newSKU }))
  }

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }))
        return
      }
      
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Only JPG, PNG, and WebP images are allowed' }))
        return
      }

      setFormData(prev => ({ ...prev, image: file }))
      setErrors(prev => ({ ...prev, image: null }))
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form validation
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (!formData.cost || parseFloat(formData.cost) <= 0) newErrors.cost = 'Valid cost is required'
    if (formData.trackInventory && (!formData.stock || parseInt(formData.stock) < 0)) {
      newErrors.stock = 'Valid stock quantity is required'
    }
    if (formData.trackInventory && (!formData.minLevel || parseInt(formData.minLevel) < 0)) {
      newErrors.minLevel = 'Valid minimum stock level is required'
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
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock) || 0,
        minLevel: parseInt(formData.minLevel) || 0,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        status: formData.trackInventory 
          ? (parseInt(formData.stock) <= parseInt(formData.minLevel) 
            ? 'Low Stock' 
            : 'In Stock')
          : 'Not Tracked',
        addedDate: new Date().toISOString(),
      }

      // Here you would typically make an API call
      console.log('Adding product:', productData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the callback function
      if (onAddProduct) {
        onAddProduct(productData)
      }
      
      // Reset form and close dialog
      handleClose()
      
    } catch (error) {
      console.error('Error adding product:', error)
      setErrors(prev => ({ ...prev, submit: 'Failed to add product. Please try again.' }))
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

  // Reset form
  const handleClose = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      supplier: '',
      price: '',
      cost: '',
      stock: '',
      minLevel: '',
      unit: 'piece',
      description: '',
      location: '',
      weight: '',
      dimensions: '',
      barcode: '',
      trackInventory: true,
      notifyLowStock: true,
      image: null,
    })
    setErrors({})
    setImagePreview(null)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add New Product"
      description="Add a new product to your inventory. Fill in all required fields."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Image Upload */}
        {/* <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="relative h-32 w-32 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-gray-400">
                    <Package className="h-8 w-8" />
                    <span className="mt-2 text-xs">Upload image</span>
                  </div>
                )}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData(prev => ({ ...prev, image: null }))
                    }}
                    className="absolute right-1 top-1 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Upload className="h-4 w-4" />}
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  Upload Image
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setImagePreview(null)}
                >
                  Remove
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Recommended: 500x500px, JPG, PNG or WebP. Max 5MB.
              </p>
              {errors.image && (
                <p className="text-sm text-red-600">{errors.image}</p>
              )}
            </div>
          </div>
        </div> */}

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <span>Product Name *</span>
              <Info className="h-3 w-3 text-gray-400" />
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Premium Oil Filter"
              error={errors.name}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span>SKU *</span>
              <button
                type="button"
                onClick={generateSKU}
                className="text-xs font-normal text-blue-600 hover:text-blue-800"
              >
                Generate SKU
              </button>
            </label>
            <Input
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              placeholder="e.g., OF-2023-X"
              leftIcon={<Hash className="h-4 w-4" />}
              error={errors.sku}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category *</label>
            <Select
              options={categories}
              value={formData.category}
              onChange={(value) => handleChange('category', value)}
              placeholder="Select category"
              error={errors.category}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Supplier</label>
            <Select
              options={suppliers}
              value={formData.supplier}
              onChange={(value) => handleChange('supplier', value)}
              placeholder="Select supplier"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <span>Units *</span>
              <Info className="h-3 w-3 text-gray-400" />
            </label>
            <Input
              type="number"
              min="0"
              step="0"
              value={formData.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              placeholder="0"
              error={errors.unit}
              required
            />
          </div>

          {/* <div className="space-y-2">
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <span>Cost Price *</span>
              <Info className="h-3 w-3 text-gray-400" />
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleChange('cost', e.target.value)}
              placeholder="0.00"
              leftIcon={<DollarSign className="h-4 w-4" />}
              error={errors.cost}
              required
            />
          </div> */}

          {/* <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Unit</label>
            <Select
              options={units}
              value={formData.unit}
              onChange={(value) => handleChange('unit', value)}
            />
          </div> */}
        </div>

        {/* Inventory Tracking */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Inventory Tracking</h3>
              <p className="text-sm text-gray-500">
                Track stock levels and receive low stock alerts
              </p>
            </div>
            <Switch
              checked={formData.trackInventory}
              onChange={(checked) => handleChange('trackInventory', checked)}
            />
          </div>

          {formData.trackInventory && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Initial Stock Quantity *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="0"
                  error={errors.stock}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Minimum Stock Level *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.minLevel}
                  onChange={(e) => handleChange('minLevel', e.target.value)}
                  placeholder="0"
                  error={errors.minLevel}
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{errors.submit}</span>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            leftIcon={<Package className="h-4 w-4" />}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}