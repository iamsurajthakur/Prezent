import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import { useAuthStore } from '@/States/auth.states';

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
