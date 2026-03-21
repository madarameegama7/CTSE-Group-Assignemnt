import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';

// Patient
import PatientLayout      from './pages/patient/PatientLayout';
import PatientDashboard   from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import FindDoctors        from './pages/patient/FindDoctors';
import MedicalRecords     from './pages/patient/MedicalRecords';

// Doctor
import DoctorLayout       from './pages/doctor/DoctorLayout';
import DoctorDashboard    from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatients     from './pages/doctor/DoctorPatients';
import DoctorSchedule     from './pages/doctor/DoctorSchedule';

// Admin
import AdminLayout        from './pages/admin/AdminLayout';
import AdminDashboard     from './pages/admin/AdminDashboard';
import AdminUsers         from './pages/admin/AdminUsers';
import AdminDoctors       from './pages/admin/AdminDoctors';
import AdminAppointments  from './pages/admin/AdminAppointments';
import AdminReports       from './pages/admin/AdminReports';

import ProtectedRoute from './components/ProtectedRoute';

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'PATIENT') return <Navigate to="/patient/dashboard" replace />;
  if (user.role === 'DOCTOR')  return <Navigate to="/doctor/dashboard"  replace />;
  if (user.role === 'ADMIN')   return <Navigate to="/admin/dashboard"   replace />;
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root redirect */}
          <Route path="/"      element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />

          {/* ── Patient Portal ── */}
          <Route path="/patient" element={
            <ProtectedRoute role="PATIENT"><PatientLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"    element={<PatientDashboard />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="find-doctors" element={<FindDoctors />} />
            <Route path="records"      element={<MedicalRecords />} />
          </Route>

          {/* ── Doctor Portal ── */}
          <Route path="/doctor" element={
            <ProtectedRoute role="DOCTOR"><DoctorLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"    element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients"     element={<DoctorPatients />} />
            <Route path="schedule"     element={<DoctorSchedule />} />
          </Route>

          {/* ── Admin Portal ── */}
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"    element={<AdminDashboard />} />
            <Route path="users"        element={<AdminUsers />} />
            <Route path="doctors"      element={<AdminDoctors />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="reports"      element={<AdminReports />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
