import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createInvoice, reset } from '../store/slices/invoiceSlice';
import { logout } from '../store/slices/authSlice';
import { Plus, Trash2, ArrowLeft, LogOut, User, Calculator } from 'lucide-react';

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message, currentInvoice } = useSelector(
    (state) => state.invoice
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      products: [{ name: '', qty: 1, rate: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const watchedProducts = watch('products');

  // Calculate totals
  const calculateTotals = () => {
    let totalCharges = 0;
    
    watchedProducts.forEach((product) => {
      const qty = parseFloat(product.qty) || 0;
      const rate = parseFloat(product.rate) || 0;
      totalCharges += qty * rate;
    });

    const gst = totalCharges * 0.18; // 18% GST
    const totalAmount = totalCharges + gst;

    return { totalCharges, gst, totalAmount };
  };

  const { totalCharges, gst, totalAmount } = calculateTotals();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && currentInvoice) {
      toast.success('Invoice created successfully!');
      navigate('/generate-pdf');
    }

    dispatch(reset());
  }, [isError, isSuccess, message, currentInvoice, navigate, dispatch]);

  const onSubmit = (data) => {
    // Validate that at least one product has valid data
    const validProducts = data.products.filter(
      (product) => product.name.trim() && product.qty > 0 && product.rate >= 0
    );

    if (validProducts.length === 0) {
      toast.error('Please add at least one valid product');
      return;
    }

    dispatch(createInvoice({ products: validProducts }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const addProduct = () => {
    append({ name: '', qty: 1, rate: 0 });
  };

  const removeProduct = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Add Products
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-4 w-4 mr-2" />
                {user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Products Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Product Information
                  </h3>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 gap-4 sm:grid-cols-12 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="sm:col-span-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name
                        </label>
                        <input
                          {...register(`products.${index}.name`, {
                            required: 'Product name is required',
                          })}
                          type="text"
                          className="input-field"
                          placeholder="Enter product name"
                        />
                        {errors.products?.[index]?.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.products[index].name.message}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          {...register(`products.${index}.qty`, {
                            required: 'Quantity is required',
                            min: { value: 1, message: 'Quantity must be at least 1' },
                          })}
                          type="number"
                          min="1"
                          className="input-field"
                          placeholder="Qty"
                        />
                        {errors.products?.[index]?.qty && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.products[index].qty.message}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rate ($)
                        </label>
                        <input
                          {...register(`products.${index}.rate`, {
                            required: 'Rate is required',
                            min: { value: 0, message: 'Rate must be positive' },
                          })}
                          type="number"
                          step="0.01"
                          min="0"
                          className="input-field"
                          placeholder="0.00"
                        />
                        {errors.products?.[index]?.rate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.products[index].rate.message}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total
                        </label>
                        <div className="input-field bg-gray-50 flex items-center">
                          <Calculator className="h-4 w-4 text-gray-400 mr-2" />
                          ${((watchedProducts[index]?.qty || 0) * (watchedProducts[index]?.rate || 0)).toFixed(2)}
                        </div>
                      </div>

                      <div className="sm:col-span-1 flex items-end">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Totals Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Invoice Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Charges:</span>
                    <span className="font-medium">${totalCharges.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-medium">${gst.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Invoice...' : 'Next: Generate PDF'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;