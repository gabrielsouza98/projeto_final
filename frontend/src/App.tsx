import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import MyRegistrations from './pages/MyRegistrations';
import CreateEvent from './pages/CreateEvent';
import VirtualCard from './pages/VirtualCard';
import ManageEventRegistrations from './pages/ManageEventRegistrations';
import Friends from './pages/Friends';
import Messages from './pages/Messages';
import RateEvent from './pages/RateEvent';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Home redireciona para login ou dashboard
function Home() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/create"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registrations"
        element={
          <ProtectedRoute>
            <MyRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registrations/:inscricaoId/card"
        element={
          <ProtectedRoute>
            <VirtualCard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id/manage"
        element={
          <ProtectedRoute>
            <ManageEventRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <Friends />
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
        path="/events/:id/rate"
        element={
          <ProtectedRoute>
            <RateEvent />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
