import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { HostelProvider } from './context/HostelContext';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import AppRoutes from './routes/AppRoutes';
import "./styles/global.css";            
import "./styles/paymentStyles.css";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <HostelProvider>
            <BookingProvider>
              <MainLayout>
                <AppRoutes />
              </MainLayout>
              
              {/* Toast Notifications */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </BookingProvider>
          </HostelProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;