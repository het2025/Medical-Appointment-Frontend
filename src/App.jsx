import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PatientAuthProvider, usePatientAuth } from './context/PatientAuthContext';
import { SocketProvider } from './context/SocketContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PublicBooking from './pages/PublicBooking';
import CheckBooking from './pages/CheckBooking';
import PatientLogin from './pages/patient/PatientLogin';
import PatientSignup from './pages/patient/PatientSignup';
import PatientDashboard from './pages/patient/PatientDashboard';
import ChatWidget from './components/ChatWidget';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const PatientRoute = ({ children }) => {
  const { patient, loading } = usePatientAuth();
  const location = useLocation();
  if (loading) return <div>Loading...</div>;
  if (!patient) {
    // Pass the current location so we can redirect back after login
    return <Navigate to="/patient-login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <PatientAuthProvider>
          <SocketProvider>
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Patient Auth Routes */}
              <Route path="/patient-login" element={<PatientLogin />} />
              <Route path="/patient-signup" element={<PatientSignup />} />

              {/* Protected Patient Routes */}
              <Route path="/book" element={
                <PatientRoute>
                  <PublicBooking />
                </PatientRoute>
              } />
              <Route path="/patient-dashboard" element={
                <PatientRoute>
                  <PatientDashboard />
                </PatientRoute>
              } />

              {/* Check Booking can be public? Or protected? Keeping public for guests, but maybe accessible from dashboard */}
              <Route path="/check-booking" element={<CheckBooking />} />

              {/* Admin Routes */}
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ChatWidget />
          </SocketProvider>
        </PatientAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
