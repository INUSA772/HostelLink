// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// ✅ Import all pages with CORRECT names
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import HostelListPage from '../pages/HostelListPage';
import HostelDetailsPage from '../pages/HostelDetailsPage';
import Dashboard from '../pages/Dashboard';
import ProfilePage from '../pages/ProfilePage';
import MyBookings from '../pages/MyBookings';
import MyHostels from '../pages/MyHostels';
import CreateHostel from '../pages/CreateHostel';
import EditHostel from '../pages/EditHostel';
import Favorites from '../pages/Favorites';
import Messages from '../pages/Messages';
import Notifications from '../pages/Notifications';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import ForgotPassword from '../components/auth/ForgotPassword';
import PaymentConfirmation from '../pages/PaymentConfirmation';

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/hostels" element={<HostelListPage />} />
      <Route path="/hostels/:id" element={<HostelDetailsPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* STUDENT ROUTES */}
      <Route
        path="/bookings"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Favorites />
          </ProtectedRoute>
        }
      />

      {/* ✅ PAYMENT ROUTE */}
      <Route
        path="/payment/confirm/:transactionId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <PaymentConfirmation />
          </ProtectedRoute>
        }
      />

      {/* OWNER ROUTES */}
      <Route
        path="/my-hostels"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <MyHostels />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hostels/create"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <CreateHostel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hostels/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <EditHostel />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;