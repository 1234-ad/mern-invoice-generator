import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { downloadPDF, reset, clearCurrentInvoice } from '../store/slices/invoiceSlice';
import { logout } from '../store/slices/authSlice';
import { Download, ArrowLeft, LogOut, User, FileText, CheckCircle } from 'lucide-react';

const GeneratePDF = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { currentInvoice, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.invoice
  );

  useEffect(() => {
    if (!currentInvoice) {
      navigate('/dashboard');
    }
  }, [currentInvoice, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && message) {
      toast.success(message);
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const handleDownloadPDF = () => {
    if (currentInvoice) {
      dispatch(downloadPDF(currentInvoice._id));
    }
  };

  const handleBackToDashboard = () => {
    dispatch(clearCurrentInvoice());
    navigate('/dashboard');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  if (!currentInvoice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/add-product')}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Generate PDF
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
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Invoice Created Successfully!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your invoice has been generated and is ready for download.
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Invoice Header */}
            <div className="bg-gray-800 text-white px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg font-bold">L</span>
                    </div>
                    <h2 className="text-xl font-bold">INVOICE GENERATOR</h2>
                  </div>
                  <p className="text-gray-300">Levitation</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-300">Date: {formatDate(currentInvoice.date)}</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Billed To:</h3>
                  <p className="text-sm text-gray-600">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Invoice Details:</h3>
                  <p className="text-sm text-gray-600">Invoice #: {currentInvoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">Status: {currentInvoice.status}</p>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentInvoice.products.map((product, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.qty}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(product.rate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(product.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Charges:</span>
                    <span className="font-medium">{formatCurrency(currentInvoice.totalCharges)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-medium">{formatCurrency(currentInvoice.gst)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-blue-600">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(currentInvoice.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 text-white px-6 py-4 text-center">
              <p className="text-sm">
                We are pleased to provide any further information you may require and look forward to assisting with your next order.
              </p>
              <p className="text-sm mt-1">Thank you for your business!</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            
            <button
              onClick={handleDownloadPDF}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GeneratePDF;