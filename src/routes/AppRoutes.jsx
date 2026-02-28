// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// ✅ PUBLIC PAGES
import Home from '../pages/Home';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import HostelListPage from '../pages/HostelListPage';
import HostelDetailsPage from '../pages/HostelDetailsPage';
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

// ✅ CRITICAL: Import StudentDashboard and LandlordDashboard
import StudentDashboard from '../pages/StudentDashboard';
import LandlordDashboard from '../pages/LandlordDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ═══════════════════════════════════════════
          PUBLIC ROUTES - NO LOGIN REQUIRED
      ═══════════════════════════════════════════ */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/hostels" element={<HostelListPage />} />
      <Route path="/hostels/:id" element={<HostelDetailsPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* ═══════════════════════════════════════════
          PROTECTED ROUTES - LOGIN REQUIRED
      ═══════════════════════════════════════════ */}

      {/* STUDENT DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* LANDLORD DASHBOARD */}
      <Route
        path="/landlord-dashboard"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <LandlordDashboard />
          </ProtectedRoute>
        }
      />

      {/* SHARED PROTECTED ROUTES (Both roles) */}
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

      {/* STUDENT-ONLY ROUTES */}
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
      <Route
        path="/payment/confirm/:transactionId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <PaymentConfirmation />
          </ProtectedRoute>
        }
      />

      {/* OWNER-ONLY ROUTES */}
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

      {/* 404 FALLBACK */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;