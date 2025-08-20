import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const initialState = {
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Create axios instance with auth header
const createAuthAxios = (token) => {
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create invoice
export const createInvoice = createAsyncThunk(
  'invoice/create',
  async (invoiceData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const authAxios = createAuthAxios(token);
      
      const response = await authAxios.post(`${API_URL}/invoices`, invoiceData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create invoice';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all invoices
export const getInvoices = createAsyncThunk(
  'invoice/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const authAxios = createAuthAxios(token);
      
      const response = await authAxios.get(`${API_URL}/invoices`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch invoices';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Download PDF
export const downloadPDF = createAsyncThunk(
  'invoice/downloadPDF',
  async (invoiceId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const authAxios = createAuthAxios(token);
      
      const response = await authAxios.get(`${API_URL}/invoices/${invoiceId}/pdf`, {
        responseType: 'blob',
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true, message: 'PDF downloaded successfully' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to download PDF';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentInvoice = action.payload.invoice;
        state.message = action.payload.message;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoices = action.payload.invoices;
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(downloadPDF.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(downloadPDF.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(downloadPDF.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;