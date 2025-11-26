import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/admin/AdminPage';
import CustomerPage from './pages/customer/CustomerPage';
import ReceptionistPage from './pages/receptionist/ReceptionistPage';
import TechnicianPage from './pages/technician/TechnicianPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/receptionist" element={<ReceptionistPage />} />
          <Route path="/technician" element={<TechnicianPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
