import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { HostelProvider } from './context/HostelContext';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import MainLayout from './components/layout/MainLayout';
import AppRoutes from './routes/AppRoutes';
import "./styles/global.css";
import "./styles/paymentStyles.css";
import api from './services/api';

function App() {
  useEffect(() => {
    const today = new Date().toDateString();
    const lastTracked = localStorage.getItem('peza_tracked');

    if (lastTracked !== today) {
      api.post('/admin/track-visit')
        .then(() => localStorage.setItem('peza_tracked', today))
        .catch(() => {});
    }
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <HostelProvider>
              <BookingProvider>
                <MainLayout>
                  <AppRoutes />
                </MainLayout>
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
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;