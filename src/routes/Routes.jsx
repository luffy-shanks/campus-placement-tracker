// src/routes/Routes.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';
import NotFound from '../pages/NotFound';

// Public pages
const LandingPage = lazy(() => import('../pages/public/Landing'));
const LoginPage = lazy(() => import('../pages/public/Login'));
const RegisterPage = lazy(() => import('../pages/public/Register'));

// Student pages
const StudentDashboard = lazy(() => import('../pages/student/Dashboard'));
const StudentDrives = lazy(() => import('../pages/student/Drives'));
const DriveDetail = lazy(() => import('../pages/student/DriveDetail'));
const StudentApplications = lazy(() => import('../pages/student/Applications'));
const StudentProfile = lazy(() => import('../pages/student/Profile'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminPages').then(module => ({ default: module.AdminDashboard })));
const ManageDrives = lazy(() => import('../pages/admin/AdminPages').then(module => ({ default: module.ManageDrives })));
const DriveForm = lazy(() => import('../pages/admin/AdminPages').then(module => ({ default: module.DriveForm })));
const ManageStudents = lazy(() => import('../pages/admin/AdminPages').then(module => ({ default: module.ManageStudents })));
const ManageApplications = lazy(() => import('../pages/admin/AdminPages').then(module => ({ default: module.ManageApplications })));
const Companies = lazy(() => import('../pages/admin/AdminPages').then(module => ({ default: module.Companies })));
const Analytics = lazy(() => import('../pages/admin/AdminPages').then(module => ({ default: module.Analytics })));
const AdminSettings = lazy(() => import('../pages/admin/AdminPages').then(module => ({ default: module.AdminSettings })));

// Logout helper
const LogoutRedirect = () => {
  const { logout } = useAuth();
  React.useEffect(() => { logout(); }, []);
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-sm text-charcoal/60" role="status">Loading page…</div>}>
  <Routes>
    {/* Public routes */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    {/* Student protected routes */}
    <Route
      path="/student"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/student/dashboard" replace />} />
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="drives" element={<StudentDrives />} />
      <Route path="drives/:id" element={<DriveDetail />} />
      <Route path="applications" element={<StudentApplications />} />
      <Route path="profile" element={<StudentProfile />} />
    </Route>

    {/* Admin protected routes */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="drives" element={<ManageDrives />} />
      <Route path="drives/new" element={<DriveForm />} />
      <Route path="drives/:id/edit" element={<DriveForm />} />
      <Route path="students" element={<ManageStudents />} />
      <Route path="applications" element={<ManageApplications />} />
      <Route path="companies" element={<Companies />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>

    {/* Logout */}
    <Route path="/logout" element={<LogoutRedirect />} />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
  </Suspense>
);

export default AppRoutes;
