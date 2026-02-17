import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import { useAuthStore } from '@/States/auth.states';
import { useEffect } from 'react';
import { getMe } from '@/Api/auth';

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth)
  const isLoading = useAuthStore((state) => state.isLoading)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    getMe()
      .then((res) => {
        setAuth(res.data.data)
      })
      .catch(() => {
        logout()
      })
  }, [])

  if (isLoading) return <div>Loading...</div>
  
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
