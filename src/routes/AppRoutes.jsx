import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// PUBLIC PAGES
import Home               from '../pages/Home';
import LoginForm          from '../components/auth/LoginForm';
import RegisterForm       from '../components/auth/RegisterForm';
import HostelListPage     from '../pages/HostelListPage';
import HostelDetailsPage  from '../pages/HostelDetailsPage';
import About              from '../pages/About';
import Contact            from '../pages/Contact';
import NotFound           from '../pages/NotFound';
import ForgotPassword     from '../components/auth/ForgotPassword';

// PROTECTED PAGES
import StudentDashboard   from '../pages/StudentDashboard';
import LandlordDashboard  from '../pages/LandlordDashboard';
import ProfilePage        from '../pages/ProfilePage';
import Messages           from '../pages/Messages';
import Notifications      from '../pages/Notifications';
import MyBookings         from '../pages/MyBookings';
import Favorites          from '../pages/Favorites';
import MyHostels          from '../pages/MyHostels';
import CreateHostel       from '../pages/CreateHostel';
import EditHostel         from '../pages/EditHostel';
import PaymentReturn      from '../pages/PaymentReturn'; // ✅ payment return page

const AppRoutes = () => {
  return (
    <Routes>

      {/* ── PUBLIC ROUTES ── */}
      <Route path="/"                element={<Home />} />
      <Route path="/login"           element={<LoginForm />} />
      <Route path="/register"        element={<RegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/hostels"         element={<HostelListPage />} />
      <Route path="/hostels/:id"     element={<HostelDetailsPage />} />
      <Route path="/about"           element={<About />} />
      <Route path="/contact"         element={<Contact />} />

      {/* ── PAYMENT RETURN — Paychangu redirects here after payment ── */}
      {/* ✅ Must be accessible even without being fully logged in */}
      <Route
        path="/payment/confirm/:transactionRef"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <PaymentReturn />
          </ProtectedRoute>
        }
      />

      {/* ── STUDENT DASHBOARD ── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* ── LANDLORD DASHBOARD ── */}
      <Route
        path="/landlord-dashboard"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <LandlordDashboard />
          </ProtectedRoute>
        }
      />

      {/* ── SHARED PROTECTED ROUTES ── */}
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

      {/* ── STUDENT ONLY ── */}
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

      {/* ── OWNER ONLY ── */}
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

      {/* ── 404 ── */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*"    element={<Navigate to="/404" replace />} />

    </Routes>
  );
};

export default AppRoutes;