const express = require('express');
const puppeteer = require('puppeteer');
const { body, validationResult } = require('express-validator');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Invoice
router.post('/', auth, [
  body('products').isArray({ min: 1 }).withMessage('At least one product is required'),
  body('products.*.name').trim().isLength({ min: 1 }).withMessage('Product name is required'),
  body('products.*.qty').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('products.*.rate').isFloat({ min: 0 }).withMessage('Rate must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { products } = req.body;

    // Calculate totals
    let totalCharges = 0;
    const processedProducts = products.map(product => {
      const total = product.qty * product.rate;
      totalCharges += total;
      return {
        ...product,
        total
      };
    });

    const gst = totalCharges * 0.18; // 18% GST
    const totalAmount = totalCharges + gst;

    const invoice = new Invoice({
      user: req.user.userId,
      products: processedProducts,
      totalCharges,
      gst,
      totalAmount
    });

    await invoice.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      invoice
    });

  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during invoice creation' 
    });
  }
});

// Get all invoices for user
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      invoices
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching invoices' 
    });
  }
});

// Generate PDF
router.get('/:id/pdf', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ 
      _id: req.params.id, 
      user: req.user.userId 
    }).populate('user', 'name email');

    if (!invoice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invoice not found' 
      });
    }

    const html = generateInvoiceHTML(invoice);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    res.send(pdf);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating PDF' 
    });
  }
});

// HTML template for PDF generation
function generateInvoiceHTML(invoice) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `USD ${amount.toFixed(2)}`;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #2c3e50; font-size: 28px; margin-bottom: 10px; }
        .logo { width: 60px; height: 60px; background: #3498db; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; }
        .invoice-info { background: #34495e; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .invoice-info h2 { margin-bottom: 10px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-details div { flex: 1; }
        .invoice-details h3 { color: #2c3e50; margin-bottom: 10px; }
        .products-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .products-table th { background: #27ae60; color: white; padding: 12px; text-align: left; }
        .products-table td { padding: 12px; border-bottom: 1px solid #ecf0f1; }
        .products-table tr:nth-child(even) { background: #f8f9fa; }
        .totals { text-align: right; margin-top: 20px; }
        .totals div { margin: 5px 0; padding: 5px 0; }
        .total-amount { font-size: 18px; font-weight: bold; color: #2c3e50; border-top: 2px solid #3498db; padding-top: 10px; }
        .footer { text-align: center; margin-top: 40px; padding: 20px; background: #34495e; color: white; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">L</div>
          <h1>INVOICE GENERATOR</h1>
        </div>

        <div class="invoice-info">
          <h2>Invoice Details</h2>
          <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
          <p><strong>Date:</strong> ${formatDate(invoice.date)}</p>
        </div>

        <div class="invoice-details">
          <div>
            <h3>Billed To:</h3>
            <p><strong>${invoice.user.name}</strong></p>
            <p>${invoice.user.email}</p>
          </div>
          <div>
            <h3>From:</h3>
            <p><strong>Levitation</strong></p>
            <p>Invoice Generator Service</p>
          </div>
        </div>

        <table class="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.products.map(product => `
              <tr>
                <td>${product.name}</td>
                <td>${product.qty}</td>
                <td>${formatCurrency(product.rate)}</td>
                <td>${formatCurrency(product.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div>Total Charges: ${formatCurrency(invoice.totalCharges)}</div>
          <div>GST (18%): ${formatCurrency(invoice.gst)}</div>
          <div class="total-amount">Total Amount: ${formatCurrency(invoice.totalAmount)}</div>
        </div>

        <div class="footer">
          <p>We are pleased to provide any further information you may require and look forward to assisting with your next order.</p>
          <p>Thank you for your business!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;