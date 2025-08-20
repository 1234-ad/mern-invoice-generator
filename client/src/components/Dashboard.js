import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getInvoices, downloadPDF, reset } from '../store/slices/invoiceSlice';
import { logout } from '../store/slices/authSlice';
import { Plus, Download, FileText, LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { invoices, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.invoice
  );

  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && message) {
      toast.success(message);
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleDownloadPDF = (invoiceId) => {
    dispatch(downloadPDF(invoiceId));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Invoice Generator
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-gray-600 mb-4">
                Manage your invoices and generate professional PDFs.
              </p>
              <button
                onClick={() => navigate('/add-product')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Invoice
              </button>
            </div>
          </div>

          {/* Invoices List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Invoices
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your generated invoices and their details.
              </p>
            </div>

            {isLoading ? (
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading invoices...</p>
                </div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No invoices
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first invoice.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/add-product')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <li key={invoice._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {invoice.invoiceNumber}
                              </p>
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {invoice.status}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <p>
                                {invoice.products.length} product{invoice.products.length !== 1 ? 's' : ''} • 
                                Created {formatDate(invoice.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(invoice.totalAmount)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Total Amount
                            </p>
                          </div>
                          <button
                            onClick={() => handleDownloadPDF(invoice._id)}
                            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;