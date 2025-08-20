# MERN Stack Invoice Generator

A full-stack web application for creating and managing professional invoices with PDF generation capabilities. Built with MongoDB, Express.js, React, and Node.js.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Invoice Management**: Create, view, and manage invoices
- **Product Management**: Add multiple products with quantity and rate calculations
- **PDF Generation**: Generate professional PDF invoices using Puppeteer
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Calculations**: Automatic GST (18%) and total calculations
- **Form Validation**: Comprehensive client and server-side validation
- **State Management**: Redux Toolkit for efficient state management

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Puppeteer** - PDF generation
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/1234-ad/mern-invoice-generator.git
   cd mern-invoice-generator
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/invoice-generator
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   PORT=5000
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB installation
   mongod
   
   # Or use MongoDB Atlas cloud connection string in .env
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   npm run dev
   ```

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd client
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Production Mode

1. **Build the React app**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📱 Application Flow

1. **Registration/Login**: Users can create an account or sign in
2. **Dashboard**: View all created invoices and their status
3. **Add Products**: Create new invoices by adding products with quantities and rates
4. **Generate PDF**: Preview and download professional PDF invoices
5. **Invoice Management**: View, download, and manage all invoices

## 🎨 UI/UX Features

- Clean and modern interface design
- Responsive layout for all device sizes
- Real-time form validation with error messages
- Loading states and success notifications
- Professional invoice PDF layout matching Figma design
- Intuitive navigation and user flow

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Invoices
- `GET /api/invoices` - Get all user invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/:id/pdf` - Download invoice PDF

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS configuration
- Helmet for security headers

## 📦 Deployment

### Vercel (Recommended for Frontend)

1. **Build the project**
   ```bash
   cd client && npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

### Backend Deployment Options

- **Railway**: Easy Node.js deployment
- **Render**: Free tier available
- **Heroku**: Classic PaaS option
- **DigitalOcean**: VPS deployment

### Environment Variables for Production

Make sure to set these environment variables in your deployment platform:
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

## 🧪 Testing

Run the application locally and test the following features:

1. User registration and login
2. Adding products to create invoices
3. Viewing invoice list on dashboard
4. PDF generation and download
5. Form validation and error handling
6. Responsive design on different screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from Figma assignment requirements
- React and Node.js communities for excellent documentation
- Tailwind CSS for the utility-first CSS framework
- Puppeteer team for PDF generation capabilities

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Built with ❤️ using the MERN Stack**